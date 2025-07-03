"use client"

import { useEffect } from "react"
import type { UseFormReturn } from "react-hook-form"
import type { useMembershipStore } from "@/store/membership-store"

/**
 * Custom hook to persist form data to a Zustand store and load it on mount.
 * @param storeKey The key for the persistence store (e.g., 'membershipForm').
 * @param useStore The Zustand store hook.
 * @param formMethods The react-hook-form methods object.
 */
export function useFormPersistence(
  storeKey: string,
  useStore: typeof useMembershipStore,
  formMethods: UseFormReturn<any>,
) {
  const formData = useStore((state) => state.formData)
  const setFormData = useStore((state) => state.setFormData)

  // Load data from store into form on initial mount
  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      // Since the store now handles date hydration, we can use the data directly
      formMethods.reset(formData)
    }
  }, [formData, formMethods])

  // Save form data to store whenever form values change
  useEffect(() => {
    const subscription = formMethods.watch((value, { name, type }) => {
      // Only update the store if it's a user input change
      if (type && name) {
        setFormData(value)
      }
    })
    return () => subscription.unsubscribe()
  }, [formMethods, setFormData])
}
