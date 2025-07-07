'use client'

import { forwardRef } from 'react'

interface FullMembershipData {
  _id: string
  id: string
  memberType: string
  salutation: string
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
  city: string
  state: string
  country: string
  postalCode: string
  membershipCategory: string
  membershipYears: string
  membershipPrice: string
  paymentMode: string
  status: string
  submittedAt: string
  [key: string]: any
}

interface MembershipReportProps {
  members: FullMembershipData[]
  forwardedRef: React.RefObject<HTMLDivElement | null>
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatCurrency = (amount: string) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0
  }).format(parseInt(amount))
}

export const MembershipReport = ({ members, forwardedRef }: MembershipReportProps) => (
  <div ref={forwardedRef} className="p-8 bg-white text-black">
    {/* Report Header */}
    <div className="text-center mb-8 border-b-2 border-gray-800 pb-6">
      <h1 className="text-3xl font-bold text-gray-800">Coastal Grand Hotel</h1>
      <h2 className="text-xl font-semibold text-gray-600 mt-2">Membership Report</h2>
      <p className="text-gray-500 mt-2">Generated on: {new Date().toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}</p>
      <p className="text-gray-500">Total Members: {members.length}</p>
    </div>

    {/* Summary Statistics */}
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Summary Statistics</h3>
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="text-center border border-gray-300 p-3 rounded">
          <p className="font-semibold">Total Members</p>
          <p className="text-2xl font-bold text-blue-600">{members.length}</p>
        </div>
        <div className="text-center border border-gray-300 p-3 rounded">
          <p className="font-semibold">Bronze</p>
          <p className="text-2xl font-bold text-orange-600">{members.filter(m => m.membershipCategory === 'bronze').length}</p>
        </div>
        <div className="text-center border border-gray-300 p-3 rounded">
          <p className="font-semibold">Silver</p>
          <p className="text-2xl font-bold text-gray-600">{members.filter(m => m.membershipCategory === 'silver').length}</p>
        </div>
        <div className="text-center border border-gray-300 p-3 rounded">
          <p className="font-semibold">Gold</p>
          <p className="text-2xl font-bold text-yellow-600">{members.filter(m => m.membershipCategory === 'gold').length}</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center border border-gray-300 p-3 rounded">
          <p className="font-semibold">Platinum</p>
          <p className="text-2xl font-bold text-purple-600">{members.filter(m => m.membershipCategory === 'platinum').length}</p>
        </div>
        <div className="text-center border border-gray-300 p-3 rounded">
          <p className="font-semibold">Diamond</p>
          <p className="text-2xl font-bold text-cyan-600">{members.filter(m => m.membershipCategory === 'diamond').length}</p>
        </div>
        <div className="text-center border border-gray-300 p-3 rounded">
          <p className="font-semibold">Total Revenue</p>
          <p className="text-xl font-bold text-green-600">
            {formatCurrency(members.reduce((sum, m) => sum + parseInt(m.membershipPrice || '0'), 0).toString())}
          </p>
        </div>
      </div>
    </div>

    {/* Member Details Table */}
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Member Details</h3>
      <table className="w-full border-collapse border border-gray-400 text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-400 p-2 text-left">ID</th>
            <th className="border border-gray-400 p-2 text-left">Name</th>
            <th className="border border-gray-400 p-2 text-left">Email</th>
            <th className="border border-gray-400 p-2 text-left">Mobile</th>
            <th className="border border-gray-400 p-2 text-left">Category</th>
            <th className="border border-gray-400 p-2 text-left">Years</th>
            <th className="border border-gray-400 p-2 text-left">Amount</th>
            <th className="border border-gray-400 p-2 text-left">Location</th>
            <th className="border border-gray-400 p-2 text-left">Occupation</th>
            <th className="border border-gray-400 p-2 text-left">Payment</th>
            <th className="border border-gray-400 p-2 text-left">Date</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member, index) => (
            <tr key={member._id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
              <td className="border border-gray-400 p-2">{member.id}</td>
              <td className="border border-gray-400 p-2">
                {member.salutation ? `${member.salutation} ` : ''}{member.firstName} {member.lastName}
              </td>
              <td className="border border-gray-400 p-2">{member.contactEmail}</td>
              <td className="border border-gray-400 p-2">{member.contactMobile}</td>
              <td className="border border-gray-400 p-2 font-medium">{member.membershipCategory.toUpperCase()}</td>
              <td className="border border-gray-400 p-2">{member.membershipYears}</td>
              <td className="border border-gray-400 p-2 font-medium">{formatCurrency(member.membershipPrice)}</td>
              <td className="border border-gray-400 p-2">{member.city}, {member.state}</td>
              <td className="border border-gray-400 p-2">{member.profession || 'N/A'}</td>
              <td className="border border-gray-400 p-2">{member.paymentMode}</td>
              <td className="border border-gray-400 p-2">{formatDate(member.submittedAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* Report Footer */}
    <div className="text-center text-gray-500 text-sm border-t border-gray-300 pt-4">
      <p>This report was generated automatically by the Coastal Grand Hotel Membership Management System</p>
      <p>© {new Date().getFullYear()} Coastal Grand Hotel. All rights reserved.</p>
    </div>
  </div>
)

export type { FullMembershipData } 