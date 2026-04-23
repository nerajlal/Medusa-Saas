"use client"

import { useCart } from "./CartProvider"
import Link from "next/link"

export default function CartCount() {
  const { cart } = useCart()
  const itemCount = cart?.items?.reduce((acc: number, item: any) => acc + item.quantity, 0) || 0

  return (
    <Link href="/cart" className="hover:text-black transition-colors">
      Cart ({itemCount})
    </Link>
  )
}
