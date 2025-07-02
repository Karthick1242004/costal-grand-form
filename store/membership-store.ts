import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { formFields } from "@/lib/form-fields"

// Define the type for the form state
type MembershipFormState = {
  [key: string]: any // Allows for dynamic keys based on form fields
}

// Define the type for the store actions
type MembershipStore = {
  formData: MembershipFormState
  setFormData: (data: MembershipFormState) => void
  updateField: (fieldName: string, value: any) => void
  resetForm: () => void
}

// Helper function to convert date strings back to Date objects
const hydrateDates = (data: MembershipFormState): MembershipFormState => {
  const hydratedData: MembershipFormState = {}

  for (const key in data) {
    const fieldConfig = formFields.find((f) => f.name === key)

    if (fieldConfig && fieldConfig.type === "date") {
      const value = data[key]
      if (typeof value === "string" && value) {
        const date = new Date(value)
        hydratedData[key] = isNaN(date.getTime()) ? null : date
      } else {
        hydratedData[key] = null
      }
    } else {
      hydratedData[key] = data[key]
    }
  }

  return hydratedData
}

// Helper function to serialize dates to strings for storage
const serializeDates = (data: MembershipFormState): MembershipFormState => {
  const serializedData: MembershipFormState = {}

  for (const key in data) {
    const fieldConfig = formFields.find((f) => f.name === key)

    if (fieldConfig && fieldConfig.type === "date" && data[key] instanceof Date) {
      serializedData[key] = data[key].toISOString()
    } else {
      serializedData[key] = data[key]
    }
  }

  return serializedData
}

// Create the Zustand store with persistence
export const useMembershipStore = create<MembershipStore>()(
  persist(
    (set, get) => ({
      formData: {},
      setFormData: (data) => set({ formData: data }),
      updateField: (fieldName, value) =>
        set((state) => ({
          formData: {
            ...state.formData,
            [fieldName]: value,
          },
        })),
      resetForm: () => set({ formData: {} }),
    }),
    {
      name: "hotel-membership-form", // unique name for local storage key
      storage: createJSONStorage(() => localStorage),
      // Custom serialization and deserialization
      serialize: (state) => {
        return JSON.stringify({
          ...state,
          state: {
            ...state.state,
            formData: serializeDates(state.state.formData),
          },
        })
      },
      deserialize: (str) => {
        const parsed = JSON.parse(str)
        return {
          ...parsed,
          state: {
            ...parsed.state,
            formData: hydrateDates(parsed.state.formData),
          },
        }
      },
      // Optional: Partialize the state to only store formData
      partialize: (state) => ({ formData: state.formData }),
    },
  ),
)
