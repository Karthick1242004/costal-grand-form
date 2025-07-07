'use client'

import { forwardRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Crown, User, MapPin, Phone, Mail, CreditCard, Calendar, FileText, Download, Printer } from 'lucide-react'

export interface UserMembershipData {
  _id?: string
  id: string
  memberType: string
  salutation?: string
  firstName: string
  lastName: string
  dateOfBirth: string
  occupation: string
  profession: string
  annualIncome: string
  contactEmail: string
  contactMobile: string
  premisesName: string
  roadStreetLane: string
  areaLocality: string
  city: string
  state: string
  country: string
  postalCode: string
  membershipCategory: string
  membershipYears: string
  membershipPrice: string
  paymentMode: string
  downPaymentAmount: string
  downPaymentOption: string
  status: string
  submittedAt: string
  [key: string]: any
}

interface UserMembershipReportProps {
  memberData: UserMembershipData
  onClose?: () => void
  showPrintOptions?: boolean
}

const formatDate = (dateString: string | Date) => {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatCurrency = (amount: string | number) => {
  const numericAmount = typeof amount === 'string' ? parseInt(amount) || 0 : amount
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0
  }).format(numericAmount)
}

const getTierColor = (category: string) => {
  switch (category.toLowerCase()) {
    case 'bronze': return 'bg-gradient-to-r from-amber-600 to-orange-600'
    case 'silver': return 'bg-gradient-to-r from-slate-600 to-gray-600'
    case 'gold': return 'bg-gradient-to-r from-yellow-500 to-amber-500'
    case 'platinum': return 'bg-gradient-to-r from-purple-600 to-indigo-600'
    case 'diamond': return 'bg-gradient-to-r from-cyan-600 to-blue-600'
    default: return 'bg-gradient-to-r from-blue-600 to-indigo-600'
  }
}

const getTierIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'bronze': return '🥉'
    case 'silver': return '🥈'
    case 'gold': return '🥇'
    case 'platinum': return '💎'
    case 'diamond': return '💠'
    default: return '👑'
  }
}

export const UserMembershipReport = forwardRef<HTMLDivElement, UserMembershipReportProps>(
  ({ memberData, onClose, showPrintOptions = true }, ref) => {
    const handlePrint = () => {
      window.print()
    }

    const handleDownload = () => {
      // Create a printable version
      const printWindow = window.open('', '_blank')
      if (printWindow) {
        const reportElement = document.getElementById('membership-report-content')
        if (reportElement) {
          printWindow.document.write(`
            <!DOCTYPE html>
            <html>
              <head>
                <title>Membership Report - ${memberData.firstName} ${memberData.lastName}</title>
                <style>
                  body { font-family: Arial, sans-serif; margin: 20px; }
                  .report-content { max-width: 800px; margin: 0 auto; }
                  .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 20px; }
                  .section { margin-bottom: 20px; }
                  .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
                  .field { margin-bottom: 10px; }
                  .label { font-weight: bold; }
                  .badge { background: #f0f0f0; padding: 4px 8px; border-radius: 4px; display: inline-block; }
                  @media print { button { display: none; } }
                </style>
              </head>
              <body>
                ${reportElement.innerHTML}
              </body>
            </html>
          `)
          printWindow.document.close()
          printWindow.print()
        }
      }
    }

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${getTierColor(memberData.membershipCategory)} text-white`}>
                  <Crown className="w-6 h-6" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Membership Confirmation</CardTitle>
                  <p className="text-sm text-muted-foreground">Application submitted successfully</p>
                </div>
              </div>
              {showPrintOptions && (
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={handlePrint} className="flex items-center gap-2">
                    <Printer className="w-4 h-4" />
                    Print
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDownload} className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                  {onClose && (
                    <Button variant="outline" size="sm" onClick={onClose}>
                      Close
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent className="overflow-y-auto" ref={ref}>
            <div id="membership-report-content" className="space-y-6">
              {/* Header */}
              <div className="text-center py-6 border-b border-gray-200">
                <h1 className="text-3xl font-bold text-gray-800">Coastal Grand Hotel</h1>
                <h2 className="text-xl font-semibold text-gray-600 mt-2">Membership Confirmation Report</h2>
                <p className="text-sm text-gray-500 mt-3">
                  Generated on: {formatDate(new Date().toISOString())}
                </p>
              </div>

              {/* Membership Status */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-green-800 mb-2">Application Status</h3>
                    <p className="text-sm text-green-600 leading-relaxed">Your membership application has been received and is being processed.</p>
                  </div>
                  <div className="ml-4">
                    <Badge variant="secondary" className="bg-green-100 text-green-800 text-sm px-4 py-2 font-medium">
                      {memberData.status.charAt(0).toUpperCase() + memberData.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Membership Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Crown className="w-5 h-5" />
                      Membership Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between py-1">
                      <span className="font-medium text-sm">Membership ID:</span>
                      <Badge variant="outline" className="font-mono text-xs">{memberData.id}</Badge>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span className="font-medium text-sm">Category:</span>
                      <Badge className={`${getTierColor(memberData.membershipCategory)} text-white text-xs`}>
                        {getTierIcon(memberData.membershipCategory)} {memberData.membershipCategory.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span className="font-medium text-sm">Duration:</span>
                      <span className="font-medium">{memberData.membershipYears} years</span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span className="font-medium text-sm">Total Amount:</span>
                      <span className="font-bold text-green-600">{formatCurrency(memberData.membershipPrice)}</span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span className="font-medium text-sm">Submitted:</span>
                      <span className="font-medium text-sm">{formatDate(memberData.submittedAt)}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <User className="w-5 h-5" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-2 items-center">
                      <span className="font-medium text-sm">Name:</span>
                      <p className="col-span-2 text-lg">{memberData.salutation ? `${memberData.salutation} ` : ''}{memberData.firstName} {memberData.lastName}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-2 items-center">
                      <span className="font-medium text-sm">Date of Birth:</span>
                      <p className="col-span-2">{formatDate(memberData.dateOfBirth)}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-2 items-center">
                      <span className="font-medium text-sm">Occupation:</span>
                      <p className="col-span-2">{memberData.profession || memberData.occupation}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-2 items-center">
                      <span className="font-medium text-sm">Annual Income:</span>
                      <p className="col-span-2">{formatCurrency(memberData.annualIncome)}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Information */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <MapPin className="w-5 h-5" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h4 className="font-semibold flex items-center gap-2 text-sm text-gray-700">
                        <Phone className="w-4 h-4" />
                        Contact Details
                      </h4>
                      <div className="space-y-3">
                        <div className="grid grid-cols-3 gap-2 items-center">
                          <span className="font-medium text-sm">Mobile:</span>
                          <p className="col-span-2">{memberData.contactMobile}</p>
                        </div>
                        <div className="grid grid-cols-3 gap-2 items-center">
                          <span className="font-medium text-sm">Email:</span>
                          <p className="col-span-2 break-all">{memberData.contactEmail}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-semibold text-sm text-gray-700">Address</h4>
                      <div className="space-y-1 text-sm">
                        <p>{memberData.premisesName}</p>
                        <p>{memberData.roadStreetLane}</p>
                        <p>{memberData.areaLocality}</p>
                        <p>{memberData.city}, {memberData.state} {memberData.postalCode}</p>
                        <p>{memberData.country}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Information */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <CreditCard className="w-5 h-5" />
                    Payment Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <span className="font-medium text-sm text-gray-700">Payment Mode:</span>
                      <p className="capitalize font-medium">{memberData.paymentMode}</p>
                    </div>
                    <div className="space-y-2">
                      <span className="font-medium text-sm text-gray-700">Down Payment:</span>
                      <p className="font-medium text-green-600">{formatCurrency(memberData.downPaymentAmount)}</p>
                    </div>
                    <div className="space-y-2">
                      <span className="font-medium text-sm text-gray-700">Payment Option:</span>
                      <p className="capitalize font-medium">{memberData.downPaymentOption}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Next Steps */}
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg text-blue-800">
                    <FileText className="w-5 h-5" />
                    Next Steps
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-blue-700">
                    <p className="text-sm leading-relaxed">1. Your application is currently under review by our membership team.</p>
                    <p className="text-sm leading-relaxed">2. You will receive a confirmation email within 24-48 hours.</p>
                    <p className="text-sm leading-relaxed">3. Our team will contact you to schedule your welcome orientation.</p>
                    <p className="text-sm leading-relaxed">4. Your membership benefits will be activated upon final approval.</p>
                  </div>
                </CardContent>
              </Card>

              {/* Footer */}
              <div className="text-center text-gray-500 text-sm border-t border-gray-200 pt-6 mt-8">
                <p className="font-medium mb-2">Thank you for choosing Coastal Grand Hotel!</p>
                <p className="text-xs">© {new Date().getFullYear()} Coastal Grand Hotel. All rights reserved.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
)

UserMembershipReport.displayName = 'UserMembershipReport'

export default UserMembershipReport 