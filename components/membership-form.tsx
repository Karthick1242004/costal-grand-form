"use client"

import { useState } from "react"
import { useForm, Controller, useWatch } from "react-hook-form"
import toast from "react-hot-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { format } from "date-fns"
import { CalendarIcon, Sparkles, Crown, Star, ChevronLeft, ChevronRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { formFields, type FormField } from "@/lib/form-fields"
import { useMembershipStore } from "@/store/membership-store"
import { useFormPersistence } from "@/hooks/use-form-persistence"
import { SignaturePad } from "@/components/ui/signature-pad"
import { TermsAndConditionsDialog } from "@/components/terms-and-conditions-dialog"
import { MultiSelect } from "@/components/multi-select"
import { ThemeToggle } from "@/components/theme-toggle"
import { Loader } from "@/components/ui/loader"

// Create a properly typed schema
const membershipFormSchema = z.object({
  fullName: z.string().min(1, "Full Name is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().optional(),
  dateOfBirth: z.date({
    required_error: "Date of Birth is required",
  }),
  preferredTier: z.string().min(1, "Preferred Membership Tier is required"),
  interests: z.array(z.string()),
  specialRequests: z.string().optional(),
  referralSource: z.string().optional(),
  marketingConsent: z.boolean().optional(),
  personalWebsite: z.string().optional(),
  signature: z.string().min(1, "Digital Signature is required"),
})

type MembershipFormData = z.infer<typeof membershipFormSchema>

// Helper function to safely format dates
const formatDate = (date: any): string => {
  if (!date) return ""
  if (date instanceof Date && !isNaN(date.getTime())) {
    return format(date, "PPP")
  }
  // If it's a string, try to parse it
  if (typeof date === "string") {
    const parsedDate = new Date(date)
    if (!isNaN(parsedDate.getTime())) {
      return format(parsedDate, "PPP")
    }
  }
  return ""
}

// Helper function to get tier icon and color
const getTierInfo = (tier: string) => {
  switch (tier) {
    case "bronze":
      return {
        icon: Star,
        color: "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400",
      }
    case "silver":
      return {
        icon: Sparkles,
        color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
      }
    case "gold":
      return {
        icon: Crown,
        color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
      }
    case "platinum":
      return {
        icon: Crown,
        color: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
      }
    default:
      return {
        icon: Star,
        color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
      }
  }
}

// Define form steps
const formSteps = [
  {
    title: "Personal Information",
    description: "Basic details about you",
    fields: ["fullName", "email", "phoneNumber", "dateOfBirth"],
  },
  {
    title: "Membership Preferences",
    description: "Choose your membership tier and interests",
    fields: ["preferredTier", "interests", "referralSource"],
  },
  {
    title: "Additional Details",
    description: "Special requests and preferences",
    fields: ["specialRequests", "marketingConsent", "personalWebsite"],
  },
  {
    title: "Signature & Terms",
    description: "Digital signature and agreement",
    fields: ["signature"],
  },
]

export default function MembershipForm() {
  const { formData, setFormData, resetForm } = useMembershipStore()
  const [isTermsDialogOpen, setIsTermsDialogOpen] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const methods = useForm<MembershipFormData>({
    resolver: zodResolver(membershipFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      dateOfBirth: new Date(1999, 0, 1), // January 1, 1999
      preferredTier: "",
      interests: [],
      specialRequests: "",
      referralSource: "",
      marketingConsent: false,
      personalWebsite: "",
      signature: "",
    },
    mode: "onChange", // Validate on change for better UX
  })

  const { handleSubmit, control, formState, reset, watch, trigger } = methods
  const { errors } = formState

  // Watch the preferred tier to show dynamic styling
  const selectedTier = useWatch({
    control,
    name: "preferredTier",
    defaultValue: ""
  })

  // Custom hook for form persistence
  useFormPersistence("hotel-membership-form", useMembershipStore, methods)

  const onSubmit = (data: MembershipFormData) => {
    if (!termsAccepted) {
      setIsTermsDialogOpen(true)
      toast.error("Please accept the Terms and Conditions to proceed.", {
        duration: 3000,
        style: {
          fontSize: "14px",
          padding: "12px 16px",
        },
      })
      return
    }

    // Start loading
    setIsSubmitting(true)
    console.log("Form submitted:", data)
  }

  const handleSubmissionComplete = () => {
    // This runs after the 1500ms loader finishes
    const data = watch() // Get current form data
    
    // Show success toast with membership tier styling
    toast.success(
      `🎉 Welcome to Grand Hotel! Your ${selectedTier?.charAt(0).toUpperCase() + selectedTier?.slice(1)} membership has been submitted successfully!`,
      {
        duration: 6000,
        style: {
          background: selectedTier === "gold" 
            ? "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)"
            : selectedTier === "platinum"
            ? "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)"
            : selectedTier === "silver"
            ? "linear-gradient(135deg, #6b7280 0%, #4b5563 100%)"
            : selectedTier === "bronze"
            ? "linear-gradient(135deg, #d97706 0%, #b45309 100%)"
            : "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
          color: "#ffffff",
          border: "none",
          fontWeight: "600",
          fontSize: "15px",
          padding: "16px 20px",
          borderRadius: "12px",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
        },
      }
    )
    
    resetForm() // Clear persisted data
    reset({
      fullName: "",
      email: "",
      phoneNumber: "",
      dateOfBirth: new Date(1999, 0, 1),
      preferredTier: "",
      interests: [],
      specialRequests: "",
      referralSource: "",
      marketingConsent: false,
      personalWebsite: "",
      signature: "",
    }) // Reset form fields
    setTermsAccepted(false) // Reset terms acceptance
    setCurrentStep(0) // Reset to first step
    setIsSubmitting(false) // Reset loading state
  }

  const handleTermsAccept = () => {
    setTermsAccepted(true)
    setIsTermsDialogOpen(false)
    toast.success("Terms and Conditions accepted! You can now submit your membership.", {
      duration: 3000,
      style: {
        fontSize: "14px",
        padding: "12px 16px",
      },
    })
    // Terms are now accepted, user can click submit again to proceed
  }

  // Helper function to render tier icon
  const renderTierIcon = (tier: string, className = "w-4 h-4") => {
    const tierInfo = getTierInfo(tier)
    const IconComponent = tierInfo.icon
    return <IconComponent className={className} />
  }

  // Navigation functions
  const nextStep = async () => {
    const currentFields = formSteps[currentStep].fields
    const isValid = await trigger(currentFields as any)
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, formSteps.length - 1))
    } else {
      toast.error("Please fill in all required fields before proceeding.", {
        duration: 3000,
        style: {
          fontSize: "14px",
          padding: "12px 16px",
        },
      })
    }
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  const goToStep = async (step: number) => {
    // If going to a previous step, allow without validation
    if (step < currentStep) {
      setCurrentStep(step)
      return
    }

    // If going to the same step, do nothing
    if (step === currentStep) {
      return
    }

    // If going to a later step, validate all previous steps
    let canProceed = true
    for (let i = 0; i < step; i++) {
      const stepFields = formSteps[i].fields
      const isStepValid = await trigger(stepFields as any)
      if (!isStepValid) {
        canProceed = false
        break
      }
    }

    if (canProceed) {
      setCurrentStep(step)
    }
    // If validation fails, user stays on current step
  }

  // Calculate progress
  const progress = ((currentStep + 1) / formSteps.length) * 100

  // Get current step fields
  const currentStepFields = formSteps[currentStep].fields
  const currentFormFields = formFields.filter((field) => currentStepFields.includes(field.name))

  return (
    <Loader 
      isLoading={isSubmitting} 
      onComplete={handleSubmissionComplete}
      duration={1500}
    >
    <div className="min-h-screen relative p-4 sm:p-6 lg:p-6 transition-colors duration-300">
      {/* Brick Background Image */}
      <div 
        className="absolute inset-0 brick-bg"
        style={{
          backgroundImage: "url('/bg-image.jpg')"
        }}
      />
      
      {/* Color Overlay for Theme Support */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50/90 via-blue-50/85 to-indigo-100/90 dark:from-slate-950/95 dark:via-blue-950/90 dark:to-indigo-950/95 transition-colors duration-300" />
      
      {/* Additional Glass Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent dark:via-black/30" />

      {/* Theme Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <div className="relative flex justify-center items-center min-h-screen">
        <Card className="w-full max-w-6xl shadow-2xl rounded-2xl overflow-hidden border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl transition-colors duration-300">
          {/* Header with dynamic gradient based on selected tier */}
          <CardHeader
            className={cn(
              "relative p-8 sm:p-12 text-white overflow-hidden transition-all duration-300",
              selectedTier === "bronze" && "bg-gradient-to-br from-amber-600 via-orange-600 to-amber-700",
              selectedTier === "silver" && "bg-gradient-to-br from-slate-600 via-gray-600 to-slate-700",
              selectedTier === "gold" && "bg-gradient-to-br from-yellow-500 via-amber-500 to-yellow-600",
              selectedTier === "platinum" && "bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-700",
              !selectedTier && "bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700",
            )}
          >
            {/* Animated background elements */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl animate-pulse" />
              <div className="absolute top-0 right-0 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000" />
              <div className="absolute -bottom-8 left-20 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-500" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <Crown className="h-10 w-10 text-white" />
                <CardTitle className="text-3xl sm:text-5xl font-bold tracking-tight">Grand Hotel</CardTitle>
              </div>
              <CardTitle className="text-xl sm:text-2xl font-semibold mb-2">Exclusive Membership</CardTitle>
              {/* <CardDescription className="text-blue-100 dark:text-purple-100 text-lg sm:text-xl max-w-2xl">
                Join our prestigious membership program and unlock a world of luxury, comfort, and unparalleled service.
              </CardDescription> */}

              {/* Tier badge if selected */}
              {selectedTier && (
                <div className="mt-2">
                  <Badge
                    className={cn(
                      "px-4 py-2 text-sm font-semibold flex items-center gap-2 w-fit",
                      getTierInfo(selectedTier).color,
                    )}
                  >
                    {renderTierIcon(selectedTier, "w-4 h-4")}
                    {selectedTier.charAt(0).toUpperCase() + selectedTier.slice(1)} Member
                  </Badge>
                </div>
              )}

              {/* Progress Bar */}
              <div className="mt-3 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-white/90">
                    Step {currentStep + 1} of {formSteps.length}
                  </span>
                  <span className="text-sm font-medium text-white/90">{Math.round(progress)}% Complete</span>
                </div>
                <Progress value={progress} className="h-2 bg-white/20" />

                {/* Step indicators */}
                <div className="flex justify-between">
                  {formSteps.map((step, index) => (
                    <button
                      key={index}
                      onClick={() => goToStep(index)}
                      className={cn(
                        "flex flex-col items-center space-y-2 text-xs font-medium transition-all duration-200",
                        index <= currentStep ? "text-white" : "text-white/50",
                        "hover:text-white cursor-pointer",
                      )}
                    >
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-200",
                          index < currentStep
                            ? "bg-white text-blue-600 border-white"
                            : index === currentStep
                              ? "bg-blue-600 text-white border-white"
                              : "bg-transparent text-white/50 border-white/30",
                        )}
                      >
                        {index < currentStep ? <Check className="w-4 h-4" /> : index + 1}
                      </div>
                      <span className="hidden sm:block text-center max-w-20">{step.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-8 sm:p-12">
            {/* Current Step Info */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">
                {formSteps[currentStep].title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400">{formSteps[currentStep].description}</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Form Fields in 2 columns on desktop, 1 column on mobile */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {currentFormFields.map((field: FormField) => (
                  <div
                    key={field.name}
                    className={cn(
                      "space-y-3 group",
                      // Make signature and textarea fields span full width
                      (field.type === "signature" || field.type === "textarea") && "lg:col-span-2",
                    )}
                  >
                    <Label
                      htmlFor={field.name}
                      className="text-lg font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2"
                    >
                      {field.label}
                      {field.required && <span className="text-red-500 text-base">*</span>}
                    </Label>
                    {field.description && (
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{field.description}</p>
                    )}
                    <Controller
                      name={field.name as keyof MembershipFormData}
                      control={control}
                      render={({ field: controllerField }) => {
                        switch (field.type) {
                          case "text":
                            return (
                              <Input
                                id={field.name}
                                placeholder={field.placeholder}
                                disabled={formState.isSubmitting}
                                type={field.inputType}
                                value={(controllerField.value as string) || ""}
                                onChange={controllerField.onChange}
                                onBlur={controllerField.onBlur}
                                name={controllerField.name}
                                ref={controllerField.ref}
                                className="h-12 text-base border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm"
                              />
                            )
                          case "textarea":
                            return (
                              <Textarea
                                id={field.name}
                                placeholder={field.placeholder}
                                disabled={formState.isSubmitting}
                                className="min-h-[120px] text-base border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm resize-none"
                                value={(controllerField.value as string) || ""}
                                onChange={controllerField.onChange}
                                onBlur={controllerField.onBlur}
                                name={controllerField.name}
                                ref={controllerField.ref}
                              />
                            )
                          case "checkbox":
                            if (field.options) {
                              // Group of checkboxes
                              return (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  {field.options.map((option) => (
                                    <div
                                      key={option.value}
                                      className="flex items-center space-x-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/30 dark:bg-slate-800/30 hover:bg-white/50 dark:hover:bg-slate-800/50 transition-all duration-200"
                                    >
                                      <Checkbox
                                        id={`${field.name}-${option.value}`}
                                        checked={
                                          Array.isArray(controllerField.value) &&
                                          (controllerField.value as string[]).includes(option.value)
                                        }
                                        onCheckedChange={(checked) => {
                                          const currentValues = Array.isArray(controllerField.value)
                                            ? (controllerField.value as string[])
                                            : []
                                          if (checked) {
                                            controllerField.onChange([...currentValues, option.value])
                                          } else {
                                            controllerField.onChange(
                                              currentValues.filter((val) => val !== option.value),
                                            )
                                          }
                                        }}
                                        disabled={formState.isSubmitting}
                                        className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                                      />
                                      <Label
                                        htmlFor={`${field.name}-${option.value}`}
                                        className="text-base font-medium cursor-pointer"
                                      >
                                        {option.label}
                                      </Label>
                                    </div>
                                  ))}
                                </div>
                              )
                            } else {
                              // Single checkbox
                              return (
                                <div className="flex items-center space-x-3 p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/30 dark:bg-slate-800/30">
                                  <Checkbox
                                    id={field.name}
                                    checked={(controllerField.value as boolean) || false}
                                    onCheckedChange={controllerField.onChange}
                                    disabled={formState.isSubmitting}
                                    className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                                  />
                                  <Label htmlFor={field.name} className="text-base font-medium cursor-pointer">
                                    {field.label}
                                  </Label>
                                </div>
                              )
                            }
                          case "radio":
                            return (
                              <RadioGroup
                                onValueChange={controllerField.onChange}
                                value={(controllerField.value as string) || ""}
                                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                              >
                                {field.options.map((option) => (
                                  <div
                                    key={option.value}
                                    className="flex items-center space-x-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/30 dark:bg-slate-800/30 hover:bg-white/50 dark:hover:bg-slate-800/50 transition-all duration-200"
                                  >
                                    <RadioGroupItem
                                      value={option.value}
                                      id={`${field.name}-${option.value}`}
                                      disabled={formState.isSubmitting}
                                      className="border-slate-400 text-blue-600"
                                    />
                                    <Label
                                      htmlFor={`${field.name}-${option.value}`}
                                      className="text-base font-medium cursor-pointer"
                                    >
                                      {option.label}
                                    </Label>
                                  </div>
                                ))}
                              </RadioGroup>
                            )
                          case "select":
                            return (
                              <Select
                                onValueChange={controllerField.onChange}
                                value={(controllerField.value as string) || ""}
                                disabled={formState.isSubmitting}
                              >
                                <SelectTrigger className="h-12 text-base border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
                                  <SelectValue placeholder={field.placeholder} />
                                </SelectTrigger>
                                <SelectContent className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-slate-200 dark:border-slate-700">
                                  {field.options.map((option) => (
                                    <SelectItem key={option.value} value={option.value} className="text-base py-3">
                                      <div className="flex items-center gap-2">
                                        {field.name === "preferredTier" && renderTierIcon(option.value, "w-4 h-4")}
                                        {option.label}
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )
                          case "multiselect":
                            return (
                              <MultiSelect
                                options={field.options}
                                value={Array.isArray(controllerField.value) ? (controllerField.value as string[]) : []}
                                onChange={controllerField.onChange}
                                placeholder={field.placeholder}
                                disabled={formState.isSubmitting}
                              />
                            )
                          case "date":
                            return (
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full h-12 justify-start text-left font-normal text-base border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm",
                                      !controllerField.value && "text-slate-500 dark:text-slate-400",
                                    )}
                                    disabled={formState.isSubmitting}
                                  >
                                    <CalendarIcon className="mr-3 h-5 w-5" />
                                    {controllerField.value ? (
                                      formatDate(controllerField.value as Date)
                                    ) : (
                                      <span>{field.placeholder || "Pick a date"}</span>
                                    )}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-slate-200 dark:border-slate-700">
                                  <Calendar
                                    mode="single"
                                    selected={controllerField.value as Date}
                                    onSelect={controllerField.onChange}
                                    initialFocus
                                    className="rounded-md"
                                  />
                                </PopoverContent>
                              </Popover>
                            )
                          case "signature":
                            return (
                              <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/30 dark:bg-slate-800/30">
                                <SignaturePad
                                  value={(controllerField.value as string) || ""}
                                  onChange={controllerField.onChange}
                                  disabled={formState.isSubmitting}
                                  className="border-slate-300 dark:border-slate-600"
                                />
                              </div>
                            )
                          default:
                            return <div>Unsupported field type</div>
                        }
                      }}
                    />
                    {errors[field.name as keyof MembershipFormData] && (
                      <p className="text-sm text-red-500 font-medium flex items-center gap-2">
                        <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                        {errors[field.name as keyof MembershipFormData]?.message as string}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Terms and Conditions - Only show on last step */}
              {currentStep === formSteps.length - 1 && (
                <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="terms"
                      checked={termsAccepted}
                      onCheckedChange={(checked) => {
                        setTermsAccepted(!!checked)
                        if (!checked) {
                          setIsTermsDialogOpen(false)
                        }
                      }}
                      disabled={formState.isSubmitting}
                      className="mt-1 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="terms" className="text-base leading-relaxed cursor-pointer">
                      I have read and agree to the{" "}
                      <span
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline underline-offset-2 cursor-pointer font-semibold transition-colors"
                        onClick={() => setIsTermsDialogOpen(true)}
                      >
                        Terms and Conditions
                      </span>{" "}
                      of the Grand Hotel Membership Program.
                    </Label>
                  </div>
                  {formState.isSubmitted && !termsAccepted && (
                    <p className="text-sm text-red-500 font-medium mt-2 flex items-center gap-2">
                      <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                      You must accept the Terms and Conditions to submit.
                    </p>
                  )}
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center pt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="flex items-center gap-2 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-slate-300 dark:border-slate-600"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>

                {currentStep === formSteps.length - 1 ? (
                  <Button
                    type="submit"
                    className={cn(
                      "flex items-center gap-3 h-12 px-8 text-lg font-bold transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl",
                      selectedTier === "bronze" &&
                        "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700",
                      selectedTier === "silver" &&
                        "bg-gradient-to-r from-slate-600 to-gray-600 hover:from-slate-700 hover:to-gray-700",
                      selectedTier === "gold" &&
                        "bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600",
                      selectedTier === "platinum" &&
                        "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700",
                      !selectedTier &&
                        "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700",
                    )}
                    disabled={formState.isSubmitting}
                  >
                    {formState.isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Crown className="w-5 h-5" />
                        Become a Member
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </form>
          </CardContent>

          <CardFooter className="bg-slate-50 dark:bg-slate-800/50 p-8 text-center border-t border-slate-200 dark:border-slate-700 transition-colors duration-300">
            <div className="w-full space-y-2">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                &copy; {new Date().getFullYear()} Grand Hotel. All rights reserved.
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-500">
                Your information is secure and will be used solely for membership purposes.
              </p>
            </div>
          </CardFooter>
        </Card>

        <TermsAndConditionsDialog
          isOpen={isTermsDialogOpen}
          onAccept={handleTermsAccept}
          onClose={() => setIsTermsDialogOpen(false)}
        />
      </div>
    </div>
    </Loader>
  )
}
