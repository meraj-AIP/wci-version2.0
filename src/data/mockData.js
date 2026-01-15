import { vendors } from './vendors'

// BOM data for generating affected products
const productCategories = [
  { name: 'Industrial Motors', prefix: 'MTR' },
  { name: 'Control Systems', prefix: 'CTL' },
  { name: 'Hydraulic Components', prefix: 'HYD' },
  { name: 'Electrical Assemblies', prefix: 'ELA' },
  { name: 'Mechanical Parts', prefix: 'MEC' },
  { name: 'Sensor Modules', prefix: 'SNS' },
]

// Margin erosion threshold (percentage)
export const MARGIN_EROSION_THRESHOLD = 5

const generateBOMAnalysis = (priceChange, marginImpact) => {
  const numProducts = Math.floor(Math.random() * 5) + 2
  const affectedProducts = []

  for (let i = 0; i < numProducts; i++) {
    const category = productCategories[Math.floor(Math.random() * productCategories.length)]
    const productId = `${category.prefix}-${String(Math.floor(Math.random() * 9000) + 1000)}`
    const componentCost = (Math.random() * 500 + 50).toFixed(2)
    const usageQty = Math.floor(Math.random() * 100) + 1
    const annualVolume = Math.floor(Math.random() * 10000) + 500
    const costImpact = (parseFloat(componentCost) * usageQty * (priceChange / 100)).toFixed(2)
    const annualImpact = (parseFloat(costImpact) * (annualVolume / usageQty)).toFixed(2)

    affectedProducts.push({
      productId,
      productName: `${category.name} Assembly ${i + 1}`,
      category: category.name,
      componentCost: parseFloat(componentCost),
      usageQty,
      annualVolume,
      costImpact: parseFloat(costImpact),
      annualImpact: parseFloat(annualImpact),
    })
  }

  const totalAnnualImpact = affectedProducts.reduce((sum, p) => sum + p.annualImpact, 0)
  const totalProductsAffected = affectedProducts.length
  const highestImpactProduct = affectedProducts.reduce((max, p) => p.annualImpact > max.annualImpact ? p : max, affectedProducts[0])

  return {
    affectedProducts,
    summary: {
      totalProductsAffected,
      totalAnnualImpact: totalAnnualImpact.toFixed(2),
      avgImpactPerProduct: (totalAnnualImpact / totalProductsAffected).toFixed(2),
      highestImpactProduct: highestImpactProduct.productId,
      highestImpactAmount: highestImpactProduct.annualImpact.toFixed(2),
    }
  }
}

// Generate missing information for unknown vendors
const generateMissingInfo = (vendorCategory) => {
  if (vendorCategory !== 'Unknown') return null

  const missingFields = []
  const possibleMissing = [
    { field: 'Tax ID / VAT Number', required: true },
    { field: 'Business Registration', required: true },
    { field: 'Bank Account Details', required: true },
    { field: 'Contact Person', required: false },
    { field: 'Physical Address', required: true },
    { field: 'Payment Terms Agreement', required: true },
    { field: 'Quality Certification', required: false },
    { field: 'Insurance Documentation', required: false },
  ]

  // Randomly select some fields as missing
  possibleMissing.forEach(item => {
    if (Math.random() > 0.5) {
      missingFields.push(item)
    }
  })

  // Ensure at least 2-3 fields are missing
  if (missingFields.length < 2) {
    missingFields.push(...possibleMissing.slice(0, 3 - missingFields.length))
  }

  return {
    missingFields,
    verificationStatus: 'Pending',
    lastVerificationAttempt: null,
    suggestedActions: [
      'Request vendor documentation via email',
      'Verify business registration with local authorities',
      'Cross-reference with industry databases',
    ]
  }
}

// Generate vendor details for unknown vendors
const generateUnknownVendorDetails = (vendorName) => {
  const emails = ['info@', 'sales@', 'contact@']
  const domains = ['supplier.com', 'vendor.net', 'company.org', 'trade.io']

  return {
    claimedName: vendorName,
    emailDomain: `${emails[Math.floor(Math.random() * emails.length)]}${domains[Math.floor(Math.random() * domains.length)]}`,
    firstContact: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    previousRequests: Math.floor(Math.random() * 3),
    riskScore: Math.floor(Math.random() * 40) + 60, // 60-100 risk score
    flaggedReasons: [
      'Email domain not in approved list',
      'No previous transaction history',
      'Unable to verify business registration',
    ].slice(0, Math.floor(Math.random() * 3) + 1)
  }
}

const generateRationale = (vendor, priceChange, marginImpact, confidence) => {
  const reasons = []

  if (vendor.category === 'Strategic') {
    reasons.push(`Vendor "${vendor.name}" is classified as Strategic with trust score ${vendor.trustScore}/100.`)
  } else if (vendor.category === 'Unknown') {
    reasons.push(`Sender not recognized in vendor database. Manual verification recommended.`)
  } else {
    reasons.push(`Non-strategic vendor with trust score ${vendor.trustScore}/100.`)
  }

  if (priceChange > 0) {
    reasons.push(`Requested price increase of ${priceChange}% detected.`)
  } else {
    reasons.push(`Price reduction of ${Math.abs(priceChange)}% benefits margin.`)
  }

  if (Math.abs(marginImpact) > 3) {
    reasons.push(`Significant margin impact of ${marginImpact}% flagged for review.`)
  } else {
    reasons.push(`Margin impact of ${marginImpact}% within acceptable threshold.`)
  }

  reasons.push(`Agent confidence: ${confidence}% based on historical patterns and policy alignment.`)

  return reasons.join(' ')
}

const generateActions = (status) => {
  const actions = []
  const timestamp = new Date().toISOString()

  if (status === 'Auto-Approved' || status === 'Processed') {
    actions.push({ name: 'ERP Price Update Triggered', executor: 'AI Agent', status: 'Completed', timestamp })
    actions.push({ name: 'Supplier Notification Sent', executor: 'AI Agent', status: 'Completed', timestamp })
  } else if (status === 'Auto-Rejected') {
    actions.push({ name: 'Counter-Offer Generated', executor: 'AI Agent', status: 'Completed', timestamp })
    actions.push({ name: 'Supplier Notification Sent', executor: 'AI Agent', status: 'Completed', timestamp })
  } else if (status === 'Human Review') {
    actions.push({ name: 'Escalation Triggered', executor: 'AI Agent', status: 'Completed', timestamp })
    actions.push({ name: 'Request Parked for Review', executor: 'AI Agent', status: 'Pending', timestamp })
  }

  return actions
}

export const generateRequests = (count = 75) => {
  const statuses = ['Processed', 'Pending', 'Auto-Approved', 'Auto-Rejected', 'Human Review']
  const sources = ['Email', 'Portal', 'API', 'EDI']
  const requests = []

  for (let i = 1; i <= count; i++) {
    const vendor = vendors[Math.floor(Math.random() * vendors.length)]
    const priceChange = (Math.random() * 25 - 5).toFixed(1)
    const marginImpact = (-parseFloat(priceChange) * (0.3 + Math.random() * 0.4)).toFixed(2)
    const confidence = Math.floor(60 + Math.random() * 40)

    let status
    let decisionOwner = 'AI Agent'
    const triggers = []
    let reviewType = null // 'unknown_vendor' or 'margin_erosion'

    // Apply HITL trigger logic
    if (vendor.category === 'Unknown' || vendor.trustScore < 50) {
      triggers.push('Unknown Vendor')
      reviewType = 'unknown_vendor'
    }
    if (vendor.category === 'Strategic') {
      triggers.push('Strategic Vendor')
    }
    if (Math.abs(parseFloat(marginImpact)) > MARGIN_EROSION_THRESHOLD || parseFloat(priceChange) > 10) {
      triggers.push('High Margin Impact')
      if (reviewType !== 'unknown_vendor') {
        reviewType = 'margin_erosion'
      }
    }
    if (parseFloat(priceChange) > 10) {
      triggers.push('Significant Price Increase')
    }

    // Rejection reasons for auto-rejected items
    const rejectionReasons = [
      'Price increase exceeds acceptable threshold of 15%',
      'Insufficient justification provided for the requested change',
      'Alternative supplier available at better pricing',
      'Contract terms not aligned with company policy',
      'Vendor not approved for this product category',
      'Missing required documentation for price verification',
      'Historical pricing data shows inconsistency',
      'Margin erosion beyond acceptable limits',
    ]

    if (triggers.length > 0 && Math.random() > 0.3) {
      status = 'Human Review'
      decisionOwner = 'Pending Human'
    } else if (confidence > 85 && parseFloat(priceChange) < 5) {
      status = Math.random() > 0.3 ? 'Auto-Approved' : 'Processed'
    } else if (confidence < 70 || parseFloat(priceChange) > 15) {
      status = Math.random() > 0.5 ? 'Auto-Rejected' : 'Pending'
    } else {
      status = statuses[Math.floor(Math.random() * 3)]
    }

    // Generate rejection reason for rejected items
    const rejectionReason = status === 'Auto-Rejected'
      ? rejectionReasons[Math.floor(Math.random() * rejectionReasons.length)]
      : null

    const daysAgo = Math.floor(Math.random() * 7)
    const hoursAgo = Math.floor(Math.random() * 24)
    const receivedDate = new Date()
    receivedDate.setDate(receivedDate.getDate() - daysAgo)
    receivedDate.setHours(receivedDate.getHours() - hoursAgo)

    requests.push({
      id: `PCR-2024-${String(i).padStart(4, '0')}`,
      vendor: vendor.name,
      vendorCategory: vendor.category,
      vendorTrustScore: vendor.trustScore,
      source: 'Email',
      receivedDate: receivedDate.toISOString(),
      priceChange: parseFloat(priceChange),
      marginImpact: parseFloat(marginImpact),
      confidence,
      status,
      decisionOwner,
      slaHours: Math.floor(Math.random() * 48) + 1,
      triggers,
      reviewType: status === 'Human Review' ? reviewType : null,
      rationale: generateRationale(vendor, parseFloat(priceChange), parseFloat(marginImpact), confidence),
      rejectionReason,
      actions: generateActions(status),
      assignedReviewer: status === 'Human Review' ? ['Sarah Chen', 'Michael Torres', 'Emily Watson'][Math.floor(Math.random() * 3)] : null,
      bomAnalysis: generateBOMAnalysis(parseFloat(priceChange), parseFloat(marginImpact)),
      missingInfo: generateMissingInfo(vendor.category),
      unknownVendorDetails: vendor.category === 'Unknown' ? generateUnknownVendorDetails(vendor.name) : null,
    })
  }

  return requests.sort((a, b) => new Date(b.receivedDate) - new Date(a.receivedDate))
}

export const initialAgentActivities = [
  { message: 'Parsing incoming price change request...', timestamp: new Date() },
  { message: 'Vendor classification complete', timestamp: new Date() },
  { message: 'Margin impact analysis running...', timestamp: new Date() },
  { message: 'Policy threshold check passed', timestamp: new Date() },
]
