import { z } from "zod"

// Define the schema for form field options
export const formFieldOptionSchema = z.object({
  label: z.string(),
  value: z.string(),
})

// Define the base schema for a form field
export const baseFormFieldSchema = z.object({
  name: z.string(),
  label: z.string(),
  placeholder: z.string().optional(),
  required: z.boolean().default(false),
  description: z.string().optional(),
})

// Define schemas for different input types
export const textInputSchema = baseFormFieldSchema.extend({
  type: z.literal("text"),
  inputType: z.enum(["text", "email", "password", "number", "link"]).default("text"),
})

export const textareaInputSchema = baseFormFieldSchema.extend({
  type: z.literal("textarea"),
})

export const checkboxInputSchema = baseFormFieldSchema.extend({
  type: z.literal("checkbox"),
  options: z.array(formFieldOptionSchema).optional(), // For group checkboxes
})

export const radioInputSchema = baseFormFieldSchema.extend({
  type: z.literal("radio"),
  options: z.array(formFieldOptionSchema),
})

export const selectInputSchema = baseFormFieldSchema.extend({
  type: z.literal("select"),
  options: z.array(formFieldOptionSchema),
})

export const multiSelectInputSchema = baseFormFieldSchema.extend({
  type: z.literal("multiselect"),
  options: z.array(formFieldOptionSchema),
})

export const dateInputSchema = baseFormFieldSchema.extend({
  type: z.literal("date"),
})

export const signatureInputSchema = baseFormFieldSchema.extend({
  type: z.literal("signature"),
})

// Union type for all possible form field schemas
export const formFieldSchema = z.discriminatedUnion("type", [
  textInputSchema,
  textareaInputSchema,
  checkboxInputSchema,
  radioInputSchema,
  selectInputSchema,
  multiSelectInputSchema,
  dateInputSchema,
  signatureInputSchema,
])

export type FormField = z.infer<typeof formFieldSchema>
export type FormFieldOption = z.infer<typeof formFieldOptionSchema>

// Define the form fields for the hotel membership
export const formFields: FormField[] = [
  {
    name: "fullName",
    label: "Full Name",
    type: "text",
    inputType: "text",
    placeholder: "John Doe",
    required: true,
    description: "Please enter your full legal name.",
  },
  {
    name: "email",
    label: "Email Address",
    type: "text",
    inputType: "email",
    placeholder: "john.doe@example.com",
    required: true,
    description: "We'll send your membership details to this email.",
  },
  {
    name: "phoneNumber",
    label: "Phone Number",
    type: "text",
    inputType: "text",
    placeholder: "+1 (555) 123-4567",
    required: false,
    description: "Optional: For urgent communications.",
  },
  {
    name: "dateOfBirth",
    label: "Date of Birth",
    type: "date",
    required: true,
    description: "Required for age verification.",
  },
  {
    name: "preferredTier",
    label: "Preferred Membership Tier",
    type: "select",
    required: true,
    options: [
      { label: "Bronze", value: "bronze" },
      { label: "Silver", value: "silver" },
      { label: "Gold", value: "gold" },
      { label: "Platinum", value: "platinum" },
    ],
    placeholder: "Select a tier",
    description: "Choose your desired membership level.",
  },
  {
    name: "interests",
    label: "Interests (Select all that apply)",
    type: "multiselect",
    required: false,
    options: [
      { label: "Spa & Wellness", value: "spa" },
      { label: "Fine Dining", value: "dining" },
      { label: "Golf", value: "golf" },
      { label: "Swimming", value: "swimming" },
      { label: "Fitness", value: "fitness" },
      { label: "Events & Conferences", value: "events" },
    ],
    placeholder: "Select your interests",
    description: "Helps us tailor your membership experience.",
  },
  {
    name: "specialRequests",
    label: "Special Requests / Notes",
    type: "textarea",
    placeholder: "e.g., dietary restrictions, accessibility needs",
    required: false,
    description: "Any specific requirements or notes for your membership.",
  },
  {
    name: "referralSource",
    label: "How did you hear about us?",
    type: "radio",
    required: false,
    options: [
      { label: "Friend/Family", value: "referral" },
      { label: "Online Ad", value: "online_ad" },
      { label: "Social Media", value: "social_media" },
      { label: "Hotel Website", value: "website" },
      { label: "Other", value: "other" },
    ],
    description: "Help us understand our reach.",
  },
  {
    name: "marketingConsent",
    label: "I agree to receive marketing communications.",
    type: "checkbox",
    required: false,
    description: "Stay updated with our latest offers and news.",
  },
  {
    name: "personalWebsite",
    label: "Personal Website/Social Link",
    type: "text",
    inputType: "link",
    placeholder: "https://yourwebsite.com",
    required: false,
    description: "Optional: Share your online presence.",
  },
  {
    name: "signature",
    label: "Digital Signature",
    type: "signature",
    required: true,
    description: "Please provide your digital signature.",
  },
]
