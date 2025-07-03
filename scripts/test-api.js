#!/usr/bin/env node

const baseUrl = 'http://localhost:3000/api/membership'

// Sample membership data for different tiers
const sampleMemberships = {
  bronze: {
    memberType: 'primary',
    salutation: 'Ms.',
    firstName: 'Sarah',
    lastName: 'Johnson',
    dateOfBirth: '1985-06-20T00:00:00.000Z',
    ageRange: '35-45',
    occupation: 'business',
    profession: 'Entrepreneur',
    annualIncome: '250000-500000',
    foodPreference: 'non-veg',
    'cuisinePreference[]': ['continental', 'mexican'],
    premisesName: 'Business Center',
    roadStreetLane: 'Main Street',
    areaLocality: 'Downtown',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    postalCode: '400001',
    contactMobile: '9876543211',
    contactEmail: 'sarah.johnson@example.com',
    'preferredContactMethod[]': ['email', 'phone'],
    mailingAddress: 'office',
    'communicationMode[]': ['email'],
    membershipCategory: 'bronze',
    membershipYears: '3',
    membershipPrice: '150000',
    downPaymentAmount: '30000',
    downPaymentOption: '20%',
    paymentMode: 'credit_card',
    'kycDocumentType[]': ['aadhar', 'driving_license'],
    memberSignature: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
  },
  diamond: {
    memberType: 'primary',
    salutation: 'Dr.',
    firstName: 'Rajesh',
    lastName: 'Kumar',
    dateOfBirth: '1975-03-10T00:00:00.000Z',
    ageRange: '45-55',
    occupation: 'professional',
    profession: 'Doctor',
    firmName: 'Apollo Hospital',
    designation: 'Chief Surgeon',
    annualIncome: '1000000+',
    foodPreference: 'veg',
    'cuisinePreference[]': ['indian', 'continental', 'chinese'],
    premisesName: 'Royal Residency',
    roadStreetLane: 'Palace Road',
    areaLocality: 'Banjara Hills',
    city: 'Hyderabad',
    state: 'Telangana',
    country: 'India',
    postalCode: '500034',
    contactMobile: '9876543212',
    contactEmail: 'dr.rajesh@example.com',
    'preferredContactMethod[]': ['email', 'sms', 'phone'],
    mailingAddress: 'home',
    'communicationMode[]': ['email', 'sms'],
    membershipCategory: 'diamond',
    membershipYears: '10',
    membershipPrice: '500000',
    downPaymentAmount: '125000',
    downPaymentOption: '25%',
    paymentMode: 'dd',
    'kycDocumentType[]': ['aadhar', 'pan', 'passport'],
    memberSignature: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
  }
}

async function testAPI() {
  console.log('🧪 Testing Coastal Grand Hotel Membership API\n')

  try {
    // Test GET endpoint
    console.log('1. Testing GET endpoint...')
    const getResponse = await fetch(baseUrl)
    const getResult = await getResponse.json()
    console.log('✅ GET Response:', getResult)
    console.log('')

    // Test POST endpoint with Bronze membership
    console.log('2. Testing POST endpoint (Bronze membership)...')
    const bronzeFormData = new FormData()
    Object.entries(sampleMemberships.bronze).forEach(([key, value]) => {
      bronzeFormData.append(key, value)
    })

    const bronzeResponse = await fetch(baseUrl, {
      method: 'POST',
      body: bronzeFormData
    })
    const bronzeResult = await bronzeResponse.json()
    console.log('✅ Bronze Membership Response:', bronzeResult)
    console.log('')

    // Test POST endpoint with Diamond membership
    console.log('3. Testing POST endpoint (Diamond membership)...')
    const diamondFormData = new FormData()
    Object.entries(sampleMemberships.diamond).forEach(([key, value]) => {
      diamondFormData.append(key, value)
    })

    const diamondResponse = await fetch(baseUrl, {
      method: 'POST',
      body: diamondFormData
    })
    const diamondResult = await diamondResponse.json()
    console.log('✅ Diamond Membership Response:', diamondResult)
    console.log('')

    // Check final count
    console.log('4. Checking final membership count...')
    const finalResponse = await fetch(baseUrl)
    const finalResult = await finalResponse.json()
    console.log('✅ Final GET Response:', finalResult)

  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

// Run if script is executed directly
if (require.main === module) {
  testAPI()
}

module.exports = { testAPI, sampleMemberships } 