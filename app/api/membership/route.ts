import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function POST(request: NextRequest) {
  try {
    // Parse the form data
    const formData = await request.formData()
    
    // Convert FormData to a regular object
    const membershipData: any = {}
    
    // Handle simple fields
    for (const [key, value] of formData.entries()) {
      if (key.includes('[]')) {
        // Handle array fields (like cuisinePreference[], preferredContactMethod[], etc.)
        const arrayKey = key.replace('[]', '')
        if (!membershipData[arrayKey]) {
          membershipData[arrayKey] = []
        }
        membershipData[arrayKey].push(value)
      } else if (key.includes('Date') && value) {
        // Handle date fields
        membershipData[key] = new Date(value as string)
      } else if (key === 'emiThirdPartyPayment') {
        // Handle boolean fields
        membershipData[key] = value === 'true'
      } else {
        membershipData[key] = value
      }
    }

    // Add submission metadata
    membershipData.submittedAt = new Date()
    membershipData.status = 'pending'
    membershipData.id = generateMembershipId()

    // Connect to MongoDB
    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB)
    const collection = db.collection('users')

    // Insert the membership data
    const result = await collection.insertOne(membershipData)

    if (result.insertedId) {
      return NextResponse.json({
        success: true,
        message: 'Membership application submitted successfully',
        membershipId: membershipData.id,
        insertedId: result.insertedId
      }, { status: 201 })
    } else {
      throw new Error('Failed to insert membership data')
    }

  } catch (error) {
    console.error('Membership submission error:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to submit membership application',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    // Connect to MongoDB
    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB)
    const collection = db.collection('users')

    // Get total count of memberships
    const count = await collection.countDocuments()

    return NextResponse.json({
      success: true,
      message: 'API is working',
      totalMemberships: count,
      database: process.env.MONGODB_DB
    })

  } catch (error) {
    console.error('Database connection error:', error)
    return NextResponse.json({
      success: false,
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// Generate a unique membership ID
function generateMembershipId(): string {
  const prefix = 'CM' // Costal Member
  const timestamp = Date.now().toString().slice(-8)
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `${prefix}${timestamp}${random}`
} 