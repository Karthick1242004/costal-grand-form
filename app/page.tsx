"use client"

import { useState, useEffect } from "react"
import MembershipForm from "@/components/membership-form"
import { Loader } from "@/components/ui/loader"

export default function HomePage() {
  const [isInitialLoading, setIsInitialLoading] = useState(true)

  useEffect(() => {
    // Simulate initial page load time
    const timer = setTimeout(() => {
      setIsInitialLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const handleInitialLoadComplete = () => {
    setIsInitialLoading(false)
  }

  return (
    <main>
      <Loader 
        isLoading={isInitialLoading} 
        onComplete={handleInitialLoadComplete}
        duration={1500}
      >
        <MembershipForm />
      </Loader>
    </main>
  )
}
