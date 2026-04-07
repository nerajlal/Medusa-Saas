import { 
  AbstractFileProviderService,
  FileProviderUploadResult,
  MedusaError
} from "@medusajs/framework/utils"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { getTenantId } from "../api/tenant-context"

type TenantS3Options = {
  file_url: string
  access_key_id: string
  secret_access_key: string
  region: string
  bucket: string
  endpoint: string
}

// Custom S3 provider that dynamically prefixes paths with tenant_id
class TenantS3FileProviderService extends AbstractFileProviderService {
  static identifier = "tenant-s3"
  protected client: S3Client
  protected options: TenantS3Options

  constructor(container: any, options: TenantS3Options) {
    super(container)
    this.options = options
    this.client = new S3Client({
      region: options.region,
      credentials: {
        accessKeyId: options.access_key_id,
        secretAccessKey: options.secret_access_key,
      },
      endpoint: options.endpoint,
      forcePathStyle: true // Works better for DO Spaces/Minio
    })
  }

  async upload(file: any): Promise<FileProviderUploadResult> {
    const tenantId = getTenantId() || "public"
    const prefix = `${tenantId}/`
    const key = `${prefix}${file.originalname || file.filename}`

    const command = new PutObjectCommand({
      Bucket: this.options.bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: "public-read",
    })

    try {
      await this.client.send(command)
      return {
        url: `${this.options.file_url}/${key}`,
        key: key,
      }
    } catch (e: any) {
      throw new MedusaError(MedusaError.Types.INVALID_DATA, `S3 upload failed: ${e.message}`)
    }
  }

  async delete(fileData: any): Promise<void> {
    // Implement delete logic if needed
  }

  async getPresignedDownloadUrl(fileData: any): Promise<string> {
    return fileData.url
  }
}

export default TenantS3FileProviderService
