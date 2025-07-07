'use client'

import { useState, useEffect, useRef } from 'react'
import { useReactToPrint } from 'react-to-print'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ThemeToggle } from '@/components/theme-toggle'
import { Crown, Users, Calendar, Phone, Mail, MapPin, CreditCard, Trash2, RefreshCw, Search, Eye, Download } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { MembershipReport, type FullMembershipData } from '@/components/membership-report'

interface MembershipData {
  _id: string
  membershipId: string
  name: string
  email: string
  mobile: string
  membershipCategory: string
  membershipYears: string
  membershipPrice: string
  paymentMode: string
  status: string
  submittedAt: string
  city: string
  state: string
}

interface PaginationData {
  total: number
  limit: number
  skip: number
  hasMore: boolean
}

const getTierInfo = (tier: string) => {
  switch (tier) {
    case 'bronze':
      return { 
        color: 'bg-gradient-to-r from-amber-600 to-orange-600 text-white',
        icon: '🥉'
      }
    case 'silver':
      return { 
        color: 'bg-gradient-to-r from-slate-600 to-gray-600 text-white',
        icon: '🥈'
      }
    case 'gold':
      return { 
        color: 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white',
        icon: '🥇'
      }
    case 'platinum':
      return { 
        color: 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white',
        icon: '💎'
      }
    case 'diamond':
      return { 
        color: 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white',
        icon: '💠'
      }
    default:
      return { 
        color: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white',
        icon: '👑'
      }
  }
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

export default function AdminDashboard() {
  const [memberships, setMemberships] = useState<MembershipData[]>([])
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    limit: 10,
    skip: 0,
    hasMore: false
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState('submittedAt')
  const [sortOrder, setSortOrder] = useState('desc')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMember, setSelectedMember] = useState<FullMembershipData | null>(null)
  const [viewDetailsLoading, setViewDetailsLoading] = useState(false)
  
  // Report related state
  const [allMembersForReport, setAllMembersForReport] = useState<FullMembershipData[]>([])
  const [reportLoading, setReportLoading] = useState(false)
  const [showReport, setShowReport] = useState(false)
  const componentRef = useRef<HTMLDivElement>(null)

  // Print/Download functionality
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Coastal-Grand-Hotel-Membership-Report-${new Date().toISOString().split('T')[0]}`,
    pageStyle: `
      @page {
        size: A4;
        margin: 0.5in;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          color-adjust: exact;
        }
      }
    `
  })

  const fetchMemberships = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const params = new URLSearchParams({
        limit: pagination.limit.toString(),
        skip: pagination.skip.toString(),
        sortBy,
        sortOrder
      })

      const response = await fetch(`/api/membership/admin?${params}`)
      const data = await response.json()

      if (data.success) {
        setMemberships(data.data)
        setPagination(data.pagination)
      } else {
        setError(data.message || 'Failed to fetch memberships')
      }
    } catch (err) {
      setError('Network error occurred')
    } finally {
      setLoading(false)
    }
  }

  const fetchMemberDetails = async (membershipId: string) => {
    try {
      setViewDetailsLoading(true)
      const response = await fetch(`/api/membership/admin?membershipId=${membershipId}`)
      const data = await response.json()
      
      if (data.success && data.data.length > 0) {
        setSelectedMember(data.data[0])
      }
    } catch (err) {
      console.error('Failed to fetch member details:', err)
    } finally {
      setViewDetailsLoading(false)
    }
  }

  const deleteMembership = async (membershipId: string) => {
    if (!confirm('Are you sure you want to delete this membership?')) return

    try {
      const response = await fetch(`/api/membership/admin?membershipId=${membershipId}`, {
        method: 'DELETE'
      })
      const data = await response.json()

      if (data.success) {
        fetchMemberships() // Refresh the list
      } else {
        alert('Failed to delete membership')
      }
    } catch (err) {
      alert('Network error occurred')
    }
  }

  const fetchAllMembersForReport = async () => {
    try {
      setReportLoading(true)
      setError(null)
      
      // First, get the list of all member IDs
      const response = await fetch('/api/membership/admin?limit=1000&skip=0')
      const data = await response.json()

      if (data.success) {
        // For now, we'll use the summary data from the API
        // If full details are needed, we could fetch each member individually
        // but that would be resource intensive
        
        // Convert summary data to full data format for the report
        const fullMemberData: FullMembershipData[] = data.data.map((member: any) => ({
          _id: member._id,
          id: member.membershipId,
          memberType: 'individual', // Default value
          salutation: '', // Will be extracted from name if available
          firstName: member.name.split(' ')[0] || '',
          lastName: member.name.split(' ').slice(1).join(' ') || '',
          dateOfBirth: '',
          occupation: '',
          profession: '',
          annualIncome: '',
          contactEmail: member.email,
          contactMobile: member.mobile,
          premisesName: '',
          roadStreetLane: '',
          city: member.city,
          state: member.state,
          country: 'India',
          postalCode: '',
          membershipCategory: member.membershipCategory,
          membershipYears: member.membershipYears,
          membershipPrice: member.membershipPrice,
          paymentMode: member.paymentMode,
          status: member.status,
          submittedAt: member.submittedAt
        }))

        setAllMembersForReport(fullMemberData)
        setShowReport(true)
      } else {
        setError(data.message || 'Failed to fetch members for report')
      }
    } catch (err) {
      setError('Network error occurred while generating report')
    } finally {
      setReportLoading(false)
    }
  }

  useEffect(() => {
    fetchMemberships()
  }, [pagination.limit, pagination.skip, sortBy, sortOrder])

  const filteredMemberships = memberships.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.membershipId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.city.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const nextPage = () => {
    if (pagination.hasMore) {
      setPagination(prev => ({ ...prev, skip: prev.skip + prev.limit }))
    }
  }

  const prevPage = () => {
    if (pagination.skip > 0) {
      setPagination(prev => ({ ...prev, skip: Math.max(0, prev.skip - prev.limit) }))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950 p-4 sm:p-6 lg:p-8">
      {/* Theme Toggle and Home Link */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          asChild
          className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm"
        >
          <a href="/" target="_blank" rel="noopener noreferrer">
            🏠 Form
          </a>
        </Button>
        <ThemeToggle />
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 text-white border-0">
          <CardHeader className="pb-6">
            <div className="flex items-center gap-3">
              <Crown className="h-10 w-10" />
              <div>
                <CardTitle className="text-3xl font-bold">Coastal Grand Hotel</CardTitle>
                <p className="text-blue-100 text-lg">Membership Administration</p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Members</p>
                  <p className="text-2xl font-bold">{pagination.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Crown className="h-8 w-8 text-yellow-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Active Memberships</p>
                  <p className="text-2xl font-bold">{memberships.filter(m => m.status === 'pending').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <CreditCard className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(
                      memberships.reduce((sum, m) => sum + parseInt(m.membershipPrice || '0'), 0).toString()
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Calendar className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-sm text-muted-foreground">This Month</p>
                  <p className="text-2xl font-bold">
                    {memberships.filter(m => 
                      new Date(m.submittedAt).getMonth() === new Date().getMonth()
                    ).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <CardTitle className="text-xl">Membership Directory</CardTitle>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search members..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full sm:w-64"
                  />
                </div>
                
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="submittedAt">Date</SelectItem>
                    <SelectItem value="membershipCategory">Category</SelectItem>
                    <SelectItem value="membershipPrice">Price</SelectItem>
                    <SelectItem value="firstName">Name</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortOrder} onValueChange={setSortOrder}>
                  <SelectTrigger className="w-full sm:w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desc">Newest</SelectItem>
                    <SelectItem value="asc">Oldest</SelectItem>
                  </SelectContent>
                </Select>

                <Button onClick={fetchMemberships} variant="outline" size="icon">
                  <RefreshCw className="h-4 w-4" />
                </Button>
                
                <Button 
                  onClick={fetchAllMembersForReport} 
                  disabled={reportLoading}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {reportLoading ? (
                    <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Download className="h-4 w-4 mr-2" />
                  )}
                  {reportLoading ? 'Generating...' : 'Download Report'}
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5 animate-spin" />
                  <span>Loading memberships...</span>
                </div>
              </div>
            ) : error ? (
              <div className="text-center py-12 text-red-600">
                <p>Error: {error}</p>
                <Button onClick={fetchMemberships} className="mt-4">
                  Retry
                </Button>
              </div>
            ) : filteredMemberships.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No memberships found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Desktop Table */}
                <div className="hidden lg:block">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Member</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Membership</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredMemberships.map((member) => {
                        const tierInfo = getTierInfo(member.membershipCategory)
                        return (
                          <TableRow key={member._id}>
                            <TableCell>
                              <div>
                                <p className="font-medium">{member.name}</p>
                                <p className="text-sm text-muted-foreground">ID: {member.membershipId}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="flex items-center gap-1">
                                  <Mail className="h-3 w-3" />
                                  <span className="text-sm">{member.email}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Phone className="h-3 w-3" />
                                  <span className="text-sm">{member.mobile}</span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-2">
                                <Badge className={cn("text-xs", tierInfo.color)}>
                                  {tierInfo.icon} {member.membershipCategory.toUpperCase()}
                                </Badge>
                                <div>
                                  <p className="text-sm font-medium">{formatCurrency(member.membershipPrice)}</p>
                                  <p className="text-xs text-muted-foreground">{member.membershipYears} years</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                <span className="text-sm">{member.city}, {member.state}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm">{formatDate(member.submittedAt)}</span>
                            </TableCell>
                            <TableCell>
                              <Badge variant={member.status === 'pending' ? 'default' : 'secondary'}>
                                {member.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={() => fetchMemberDetails(member.membershipId)}
                                    >
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-2xl max-h-[80vh]">
                                    <DialogHeader>
                                      <DialogTitle>Member Details</DialogTitle>
                                    </DialogHeader>
                                    <ScrollArea className="max-h-[60vh]">
                                      {viewDetailsLoading ? (
                                        <div className="flex items-center justify-center py-8">
                                          <RefreshCw className="h-5 w-5 animate-spin" />
                                        </div>
                                      ) : selectedMember && (
                                        <div className="space-y-4">
                                          <div className="grid grid-cols-2 gap-4">
                                            <div>
                                              <p className="font-semibold">Name</p>
                                              <p>{selectedMember.salutation} {selectedMember.firstName} {selectedMember.lastName}</p>
                                            </div>
                                            <div>
                                              <p className="font-semibold">Membership ID</p>
                                              <p>{selectedMember.id}</p>
                                            </div>
                                            <div>
                                              <p className="font-semibold">Occupation</p>
                                              <p>{selectedMember.profession} ({selectedMember.occupation})</p>
                                            </div>
                                            <div>
                                              <p className="font-semibold">Annual Income</p>
                                              <p>{selectedMember.annualIncome}</p>
                                            </div>
                                          </div>
                                          <Separator />
                                          <div>
                                            <p className="font-semibold mb-2">Address</p>
                                            <p>{selectedMember.premisesName}, {selectedMember.roadStreetLane}</p>
                                            <p>{selectedMember.city}, {selectedMember.state} - {selectedMember.postalCode}</p>
                                            <p>{selectedMember.country}</p>
                                          </div>
                                          <Separator />
                                          <div className="grid grid-cols-2 gap-4">
                                            <div>
                                              <p className="font-semibold">Membership Category</p>
                                              <Badge className={cn("mt-1", getTierInfo(selectedMember.membershipCategory).color)}>
                                                {selectedMember.membershipCategory.toUpperCase()}
                                              </Badge>
                                            </div>
                                            <div>
                                              <p className="font-semibold">Payment Mode</p>
                                              <p>{selectedMember.paymentMode}</p>
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </ScrollArea>
                                  </DialogContent>
                                </Dialog>
                                
                                <Button 
                                  size="sm" 
                                  variant="destructive"
                                  onClick={() => deleteMembership(member.membershipId)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile Cards */}
                <div className="lg:hidden space-y-4">
                  {filteredMemberships.map((member) => {
                    const tierInfo = getTierInfo(member.membershipCategory)
                    return (
                      <Card key={member._id}>
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-semibold">{member.name}</p>
                                <p className="text-sm text-muted-foreground">ID: {member.membershipId}</p>
                              </div>
                              <Badge className={cn("text-xs", tierInfo.color)}>
                                {tierInfo.icon} {member.membershipCategory.toUpperCase()}
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div className="flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                <span className="truncate">{member.email}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                <span>{member.mobile}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                <span>{member.city}, {member.state}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <CreditCard className="h-3 w-3" />
                                <span>{formatCurrency(member.membershipPrice)}</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">
                                {formatDate(member.submittedAt)}
                              </span>
                              <div className="flex items-center gap-2">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={() => fetchMemberDetails(member.membershipId)}
                                    >
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-2xl max-h-[80vh]">
                                    <DialogHeader>
                                      <DialogTitle>Member Details</DialogTitle>
                                    </DialogHeader>
                                    <ScrollArea className="max-h-[60vh]">
                                      {viewDetailsLoading ? (
                                        <div className="flex items-center justify-center py-8">
                                          <RefreshCw className="h-5 w-5 animate-spin" />
                                        </div>
                                      ) : selectedMember && (
                                        <div className="space-y-4">
                                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                              <p className="font-semibold">Name</p>
                                              <p>{selectedMember.salutation} {selectedMember.firstName} {selectedMember.lastName}</p>
                                            </div>
                                            <div>
                                              <p className="font-semibold">Membership ID</p>
                                              <p>{selectedMember.id}</p>
                                            </div>
                                            <div>
                                              <p className="font-semibold">Occupation</p>
                                              <p>{selectedMember.profession} ({selectedMember.occupation})</p>
                                            </div>
                                            <div>
                                              <p className="font-semibold">Annual Income</p>
                                              <p>{selectedMember.annualIncome}</p>
                                            </div>
                                          </div>
                                          <Separator />
                                          <div>
                                            <p className="font-semibold mb-2">Address</p>
                                            <p>{selectedMember.premisesName}, {selectedMember.roadStreetLane}</p>
                                            <p>{selectedMember.city}, {selectedMember.state} - {selectedMember.postalCode}</p>
                                            <p>{selectedMember.country}</p>
                                          </div>
                                          <Separator />
                                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                              <p className="font-semibold">Membership Category</p>
                                              <Badge className={cn("mt-1", getTierInfo(selectedMember.membershipCategory).color)}>
                                                {selectedMember.membershipCategory.toUpperCase()}
                                              </Badge>
                                            </div>
                                            <div>
                                              <p className="font-semibold">Payment Mode</p>
                                              <p>{selectedMember.paymentMode}</p>
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </ScrollArea>
                                  </DialogContent>
                                </Dialog>
                                <Button 
                                  size="sm" 
                                  variant="destructive"
                                  onClick={() => deleteMembership(member.membershipId)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between pt-4">
                  <p className="text-sm text-muted-foreground">
                    Showing {pagination.skip + 1} to {Math.min(pagination.skip + pagination.limit, pagination.total)} of {pagination.total} members
                  </p>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={prevPage}
                      disabled={pagination.skip === 0}
                    >
                      Previous
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={nextPage}
                      disabled={!pagination.hasMore}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Report Dialog */}
      <Dialog open={showReport} onOpenChange={setShowReport}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Membership Report</span>
              <div className="flex items-center gap-2">
                <Button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-700">
                  <Download className="h-4 w-4 mr-2" />
                  Print/Download PDF
                </Button>
                <Button onClick={() => setShowReport(false)} variant="outline">
                  Close
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh]">
            <MembershipReport 
              members={allMembersForReport} 
              forwardedRef={componentRef}
            />
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  )
} 