export default async function checkPolicies({ container }: any) {
  const pgConnection = container.resolve("__pg_connection__")
  const res = await pgConnection.raw(`
    SELECT polname, polcmd, polqual, polwithcheck 
    FROM pg_policy 
    WHERE polrelid = 'product'::regclass
  `)
  console.log("Policies for product:", res.rows)
}
