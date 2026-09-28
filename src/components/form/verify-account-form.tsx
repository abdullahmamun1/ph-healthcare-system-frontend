"use client"
import { useSearchParams } from 'next/navigation'

export default function VerifyAccountForm() {
    const searchParams = useSearchParams()

    const email = searchParams.get("email")
  return (
    <div>
      <h1>
        User Email: {email}
      </h1>
    </div>
  )
}
