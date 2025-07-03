import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function GET(request: NextRequest) {
  try {
    // Connect to MongoDB
    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB)
    const collection = db.collection('users')

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const membershipId = searchParams.get('membershipId')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = parseInt(searchParams.get('skip') || '0')
    const sortBy = searchParams.get('sortBy') || 'submittedAt'
    const sortOrder = searchParams.get('sortOrder') === 'asc' ? 1 : -1

    // If requesting specific member details
    if (membershipId) {
      const member = await collection.findOne({ id: membershipId })
      if (member) {
        return NextResponse.json({
          success: true,
          data: [member]
        })
      } else {
        return NextResponse.json({
          success: false,
          message: 'Member not found'
        }, { status: 404 })
      }
    }

    // Get membership data with pagination and sorting
    const memberships = await collection
      .find({})
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit)
      .toArray()

    // Get total count
    const totalCount = await collection.countDocuments()

    // Transform data for better readability
    const transformedMemberships = memberships.map(membership => ({
      _id: membership._id,
      membershipId: membership.id,
      name: `${membership.firstName} ${membership.lastName}`,
      email: membership.contactEmail,
      mobile: membership.contactMobile,
      membershipCategory: membership.membershipCategory,
      membershipYears: membership.membershipYears,
      membershipPrice: membership.membershipPrice,
      paymentMode: membership.paymentMode,
      status: membership.status,
      submittedAt: membership.submittedAt,
      city: membership.city,
      state: membership.state
    }))

    return NextResponse.json({
      success: true,
      data: transformedMemberships,
      pagination: {
        total: totalCount,
        limit,
        skip,
        hasMore: skip + limit < totalCount
      },
      metadata: {
        database: process.env.MONGODB_DB,
        collection: 'users',
        sortBy,
        sortOrder: sortOrder === 1 ? 'asc' : 'desc'
      }
    })

  } catch (error) {
    console.error('Admin API error:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch membership data',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const membershipId = searchParams.get('membershipId')

    if (!membershipId) {
      return NextResponse.json({
        success: false,
        message: 'Membership ID is required'
      }, { status: 400 })
    }

    // Connect to MongoDB
    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB)
    const collection = db.collection('users')

    // Delete the membership
    const result = await collection.deleteOne({ id: membershipId })

    if (result.deletedCount === 1) {
      return NextResponse.json({
        success: true,
        message: 'Membership deleted successfully',
        membershipId
      })
    } else {
      return NextResponse.json({
        success: false,
        message: 'Membership not found'
      }, { status: 404 })
    }

  } catch (error) {
    console.error('Delete membership error:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to delete membership',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 