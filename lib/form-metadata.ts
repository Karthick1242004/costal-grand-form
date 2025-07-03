import { z } from "zod"

// Create a properly typed schema for the comprehensive membership form
export const membershipFormSchema = z.object({
  // Member Details
  memberType: z.string().min(1, "Member type is required"),
  salutation: z.string().min(1, "Salutation is required"),
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z.date({
    required_error: "Date of birth is required",
  }),
  ageRange: z.string().min(1, "Age range is required"),
  occupation: z.string().min(1, "Occupation is required"),
  profession: z.string().min(1, "Profession is required"),
  firmName: z.string().optional(),
  designation: z.string().optional(),
  facebookId: z.string().optional(),
  twitterId: z.string().optional(),
  hasOwnCar: z.string().optional(),
  annualIncome: z.string().min(1, "Annual income is required"),
  foodPreference: z.string().min(1, "Food preference is required"),
  cuisinePreference: z.array(z.string()),
  holidayDestination: z.string().optional(),

  // Co-Applicant Details
  coApplicantSalutation: z.string().optional(),
  coApplicantFirstName: z.string().optional(),
  coApplicantMiddleName: z.string().optional(),
  coApplicantLastName: z.string().optional(),
  coApplicantRelationship: z.string().optional(),
  coApplicantDateOfBirth: z.date().optional(),
  coApplicantStdCode: z.string().optional(),
  coApplicantPhone: z.string().optional(),
  coApplicantFax: z.string().optional(),
  coApplicantMobile: z.string().optional(),
  coApplicantEmail: z.string().optional(),

  // Spouse & Family Details
  spouseSalutation: z.string().optional(),
  spouseName: z.string().optional(),
  spouseDateOfBirth: z.date().optional(),
  weddingAnniversary: z.date().optional(),
  numberOfChildren: z.string().optional(),
  child1Name: z.string().optional(),
  child1Gender: z.string().optional(),
  child1DateOfBirth: z.date().optional(),
  child2Name: z.string().optional(),
  child2Gender: z.string().optional(),
  child2DateOfBirth: z.date().optional(),
  child3Name: z.string().optional(),
  child3Gender: z.string().optional(),
  child3DateOfBirth: z.date().optional(),
  spouseMobile: z.string().optional(),
  spouseEmail: z.string().optional(),

  // Address & Contact Details
  premisesName: z.string().min(1, "Premises name is required"),
  roadStreetLane: z.string().min(1, "Road/Street/Lane is required"),
  areaLocality: z.string().min(1, "Area/Locality is required"),
  landmark: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  country: z.string().min(1, "Country is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  contactStdCode: z.string().optional(),
  contactPhone: z.string().optional(),
  contactFax: z.string().optional(),
  contactMobile: z.string().min(1, "Mobile number is required"),
  contactEmail: z.string().email("Invalid email address"),

  // Communication Preferences
  preferredContactMethod: z.array(z.string()).min(1, "Select at least one contact method"),
  mailingAddress: z.string().min(1, "Mailing address is required"),
  communicationMode: z.array(z.string()).min(1, "Select at least one communication mode"),

  // Product Details
  membershipCategory: z.string().min(1, "Membership category is required"),
  membershipYears: z.string().min(1, "Number of years is required"),

  // Payment Details
  membershipPrice: z.string().min(1, "Membership price is required"),
  downPaymentAmount: z.string().min(1, "Down payment amount is required"),
  downPaymentOption: z.string().min(1, "Down payment option is required"),
  paymentMode: z.string().min(1, "Payment mode is required"),
  cashPaymentDate: z.date().optional(),
  cashPaymentAmount: z.string().optional(),
  cashReceiptNo: z.string().optional(),
  ddBankName: z.string().optional(),
  ddInsuranceNo: z.string().optional(),
  ddDate: z.date().optional(),
  creditCardNo: z.string().optional(),
  creditCardExpiry: z.date().optional(),
  creditCardAuthNo: z.string().optional(),
  creditCardType: z.array(z.string()),
  creditCardCategory: z.array(z.string()),
  issuingBankName: z.string().optional(),

  // EMI Plan
  emiOptedPercentage: z.string().optional(),
  emiPaymentMode: z.string().optional(),
  emiThirdPartyPayment: z.boolean().optional(),
  emiBankName: z.string().optional(),
  emiInstrumentNo: z.string().optional(),
  emiDate: z.date().optional(),
  emiCreditCardNo: z.string().optional(),
  emiCreditCardExpiry: z.date().optional(),
  emiCreditCardAuthNo: z.string().optional(),
  emiCreditCardType: z.array(z.string()),
  ecsBank: z.string().optional(),
  ecsDate: z.date().optional(),
  ecsMicrNo: z.string().optional(),
  ecsSampleInstrumentNo: z.string().optional(),

  // KYC Documents
  kycDocumentType: z.array(z.string()).min(1, "Select at least one document type"),
  coApplicantKycDocumentType: z.array(z.string()),
  executiveName: z.string().optional(),
  executiveCmeId: z.string().optional(),
  executiveDate: z.date().optional(),

  // Signatures
  memberSignature: z.string().min(1, "Member signature is required"),
  coApplicantSignature: z.string().optional(),
})

export type MembershipFormData = z.infer<typeof membershipFormSchema>

// Define comprehensive form steps
export const formSteps = [
  {
    title: "Personal Information",
    description: "Basic member details and preferences",
    fields: [
      "memberType", "salutation", "firstName", "middleName", "lastName", 
      "dateOfBirth", "ageRange", "occupation", "profession", "firmName", 
      "designation", "annualIncome", "foodPreference", "cuisinePreference", 
      "holidayDestination", "facebookId", "twitterId", "hasOwnCar"
    ],
  },
  {
    title: "Co-Applicant Details",
    description: "Co-applicant information (if applicable)",
    fields: [
      "coApplicantSalutation", "coApplicantFirstName", "coApplicantMiddleName", 
      "coApplicantLastName", "coApplicantRelationship", "coApplicantDateOfBirth", 
      "coApplicantStdCode", "coApplicantPhone", "coApplicantFax", 
      "coApplicantMobile", "coApplicantEmail"
    ],
  },
  {
    title: "Family & Contact Details",
    description: "Spouse, family and address information",
    fields: [
      "spouseSalutation", "spouseName", "spouseDateOfBirth", "weddingAnniversary", 
      "numberOfChildren", "child1Name", "child1Gender", "child1DateOfBirth", 
      "child2Name", "child2Gender", "child2DateOfBirth", "child3Name", 
      "child3Gender", "child3DateOfBirth", "spouseMobile", "spouseEmail", 
      "premisesName", "roadStreetLane", "areaLocality", "landmark", "city", 
      "state", "country", "postalCode", "contactStdCode", "contactPhone", 
      "contactFax", "contactMobile", "contactEmail"
    ],
  },
  {
    title: "Communication Preferences",
    description: "How you prefer to be contacted",
    fields: [
      "preferredContactMethod", "mailingAddress", "communicationMode"
    ],
  },
  {
    title: "Membership & Product Details",
    description: "Choose your membership category and duration",
    fields: [
      "membershipCategory", "membershipYears"
    ],
  },
  {
    title: "Payment Information",
    description: "Payment details and options",
    fields: [
      "membershipPrice", "downPaymentAmount", "downPaymentOption", 
      "paymentMode", "cashPaymentDate", "cashPaymentAmount", "cashReceiptNo", 
      "ddBankName", "ddInsuranceNo", "ddDate", "creditCardNo", 
      "creditCardExpiry", "creditCardAuthNo", "creditCardType", 
      "creditCardCategory", "issuingBankName"
    ],
  },
  {
    title: "EMI Plan",
    description: "EMI options and payment setup (if applicable)",
    fields: [
      "emiOptedPercentage", "emiPaymentMode", "emiThirdPartyPayment", 
      "emiBankName", "emiInstrumentNo", "emiDate", "emiCreditCardNo", 
      "emiCreditCardExpiry", "emiCreditCardAuthNo", "emiCreditCardType", 
      "ecsBank", "ecsDate", "ecsMicrNo", "ecsSampleInstrumentNo"
    ],
  },
  {
    title: "KYC Documents",
    description: "Document verification and executive details",
    fields: [
      "kycDocumentType", "coApplicantKycDocumentType", "executiveName", 
      "executiveCmeId", "executiveDate"
    ],
  },
  {
    title: "Signatures & Declaration",
    description: "Digital signatures and final confirmation",
    fields: [
      "memberSignature", "coApplicantSignature"
    ],
  },
]

// Default form values
export const defaultFormValues: Partial<MembershipFormData> = {
  // Member Details
  memberType: "",
  salutation: "",
  firstName: "",
  middleName: "",
  lastName: "",
  dateOfBirth: new Date(1999, 0, 1), // January 1, 1999
  ageRange: "",
  occupation: "",
  profession: "",
  firmName: "",
  designation: "",
  facebookId: "",
  twitterId: "",
  hasOwnCar: "",
  annualIncome: "",
  foodPreference: "",
  cuisinePreference: [],
  holidayDestination: "",

  // Co-Applicant Details
  coApplicantSalutation: "",
  coApplicantFirstName: "",
  coApplicantMiddleName: "",
  coApplicantLastName: "",
  coApplicantRelationship: "",
  coApplicantDateOfBirth: undefined,
  coApplicantStdCode: "",
  coApplicantPhone: "",
  coApplicantFax: "",
  coApplicantMobile: "",
  coApplicantEmail: "",

  // Spouse & Family Details
  spouseSalutation: "",
  spouseName: "",
  spouseDateOfBirth: undefined,
  weddingAnniversary: undefined,
  numberOfChildren: "",
  child1Name: "",
  child1Gender: "",
  child1DateOfBirth: undefined,
  child2Name: "",
  child2Gender: "",
  child2DateOfBirth: undefined,
  child3Name: "",
  child3Gender: "",
  child3DateOfBirth: undefined,
  spouseMobile: "",
  spouseEmail: "",

  // Address & Contact Details
  premisesName: "",
  roadStreetLane: "",
  areaLocality: "",
  landmark: "",
  city: "",
  state: "",
  country: "",
  postalCode: "",
  contactStdCode: "",
  contactPhone: "",
  contactFax: "",
  contactMobile: "",
  contactEmail: "",

  // Communication Preferences
  preferredContactMethod: [],
  mailingAddress: "",
  communicationMode: [],

  // Product Details
  membershipCategory: "",
  membershipYears: "",

  // Payment Details
  membershipPrice: "",
  downPaymentAmount: "",
  downPaymentOption: "",
  paymentMode: "",
  cashPaymentDate: undefined,
  cashPaymentAmount: "",
  cashReceiptNo: "",
  ddBankName: "",
  ddInsuranceNo: "",
  ddDate: undefined,
  creditCardNo: "",
  creditCardExpiry: undefined,
  creditCardAuthNo: "",
  creditCardType: [],
  creditCardCategory: [],
  issuingBankName: "",

  // EMI Plan
  emiOptedPercentage: "",
  emiPaymentMode: "",
  emiThirdPartyPayment: false,
  emiBankName: "",
  emiInstrumentNo: "",
  emiDate: undefined,
  emiCreditCardNo: "",
  emiCreditCardExpiry: undefined,
  emiCreditCardAuthNo: "",
  emiCreditCardType: [],
  ecsBank: "",
  ecsDate: undefined,
  ecsMicrNo: "",
  ecsSampleInstrumentNo: "",

  // KYC Documents
  kycDocumentType: [],
  coApplicantKycDocumentType: [],
  executiveName: "",
  executiveCmeId: "",
  executiveDate: undefined,

  // Signatures
  memberSignature: "",
  coApplicantSignature: "",
} 