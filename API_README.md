# Coastal Grand Hotel Membership API

## Overview
This Next.js API provides backend functionality for the Coastal Grand Hotel membership form, storing membership applications in MongoDB.

## Environment Setup

### Required Environment Variables
Create a `.env.local` file in the root directory with:

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://karthick1242004:9894783774@karthick124.8ruyxjc.mongodb.net/
MONGODB_DB=costal

# Next.js Configuration
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000
```

### Database Structure
- **Database**: `costal`
- **Collection**: `users`
- **Generated Fields**: 
  - `id`: Unique membership ID (format: CM{timestamp}{random})
  - `submittedAt`: Submission timestamp
  - `status`: Application status (default: "pending")

## API Endpoints

### 1. Membership Submission
**POST** `/api/membership`

Submits a new membership application with FormData.

#### Request Format
```bash
curl -X POST http://localhost:3000/api/membership \
  -F "memberType=primary" \
  -F "firstName=John" \
  -F "lastName=Doe" \
  -F "dateOfBirth=1990-01-15T00:00:00.000Z" \
  -F "membershipCategory=gold" \
  -F "cuisinePreference[]=indian" \
  -F "cuisinePreference[]=continental" \
  # ... other fields
```

#### Response
```json
{
  "success": true,
  "message": "Membership application submitted successfully",
  "membershipId": "CM566320630JLN",
  "insertedId": "6866a21886b49e717ffeac2b"
}
```

### 2. API Health Check
**GET** `/api/membership`

Checks API status and returns total membership count.

#### Response
```json
{
  "success": true,
  "message": "API is working",
  "totalMemberships": 3,
  "database": "costal"
}
```

### 3. Admin Dashboard (View Memberships)
**GET** `/api/membership/admin`

Retrieves membership data with pagination and sorting.

#### Query Parameters
- `limit`: Number of records (default: 10)
- `skip`: Records to skip (default: 0)
- `sortBy`: Field to sort by (default: "submittedAt")
- `sortOrder`: "asc" or "desc" (default: "desc")

#### Example
```bash
curl "http://localhost:3000/api/membership/admin?limit=5&sortBy=membershipCategory"
```

#### Response
```json
{
  "success": true,
  "data": [
    {
      "_id": "6866a31a86b49e717ffeac2d",
      "membershipId": "CM568901972JPG",
      "name": "Rajesh Kumar",
      "email": "dr.rajesh@example.com",
      "membershipCategory": "diamond",
      "membershipPrice": "500000",
      "status": "pending",
      "submittedAt": "2025-07-03T15:34:50.197Z"
    }
  ],
  "pagination": {
    "total": 3,
    "limit": 5,
    "skip": 0,
    "hasMore": false
  }
}
```

### 4. Delete Membership
**DELETE** `/api/membership/admin?membershipId=CM566320630JLN`

Deletes a specific membership by ID.

## Form Field Mapping

### Data Types Handled
- **Strings**: Basic text fields
- **Arrays**: Multi-select fields (append `[]` to field name)
- **Dates**: ISO string format dates
- **Booleans**: "true"/"false" strings

### Key Field Groups
1. **Personal Info**: firstName, lastName, dateOfBirth, etc.
2. **Contact Details**: contactEmail, contactMobile, address fields
3. **Membership**: membershipCategory, membershipYears, membershipPrice
4. **Payment**: paymentMode, downPaymentAmount, etc.
5. **Documents**: kycDocumentType[], signatures

## Testing

### Run Test Script
```bash
node scripts/test-api.js
```

### Manual Testing Commands
```bash
# Health check
curl -X GET http://localhost:3000/api/membership

# View memberships
curl -X GET "http://localhost:3000/api/membership/admin?limit=10" | jq

# Delete membership
curl -X DELETE "http://localhost:3000/api/membership/admin?membershipId=CM566320630JLN"
```

## Frontend Integration

The membership form automatically submits to `/api/membership` when the user completes all steps and accepts terms & conditions. The form:

1. Converts React Hook Form data to FormData
2. Handles arrays and dates properly
3. Shows success/error toast notifications
4. Displays generated membership ID to user

## Database Schema

### Example Document Structure
```json
{
  "_id": "6866a21886b49e717ffeac2b",
  "id": "CM566320630JLN",
  "memberType": "primary",
  "salutation": "Mr.",
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "1990-01-15T00:00:00.000Z",
  "membershipCategory": "gold",
  "membershipPrice": "250000",
  "cuisinePreference": ["indian", "continental"],
  "contactEmail": "john.doe@example.com",
  "submittedAt": "2025-07-03T15:30:32.063Z",
  "status": "pending"
}
```

## Error Handling

The API includes comprehensive error handling for:
- Database connection issues
- Invalid form data
- Missing required fields
- Network failures

Errors return appropriate HTTP status codes and descriptive messages.

## Security Considerations

- Environment variables for sensitive data
- Input validation and sanitization
- Error message sanitization
- MongoDB injection protection through official driver

---

## Development Notes

- Built with Next.js 13+ App Router
- Uses official MongoDB Node.js driver
- Includes connection pooling for performance
- Supports both development and production environments 