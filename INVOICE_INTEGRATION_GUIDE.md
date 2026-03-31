# Invoice Frontend-Backend Integration Guide

## Overview

Complete integration between invoice frontend templates and backend API with subscription limit enforcement.

## Features Implemented

### 1. Invoice Save Hook (`useInvoiceSave`)
Reusable hook for saving invoices across all templates.

**Features:**
- Saves invoice data to backend
- Handles subscription limit errors
- Shows loading states
- Manages error states
- Redirects to upgrade page when limit reached
- Updates Redux state

**Usage:**
```typescript
const { saving, error, saveAsDraft, saveAndContinue } = useInvoiceSave({
  templateType: 'invoice-generator',
  title,
  subtitle
});
```

### 2. Invoice Templates Integration

All invoice templates now:
- Save to backend when "Save as Draft" is clicked
- Save to backend when "Save & Continue" is clicked
- Check subscription limits before saving
- Show remaining invoice count after save
- Handle errors gracefully
- Show loading states during save

### 3. Subscription Limit Enforcement

**Free Plan (5 invoices):**
- User creates invoice → Backend checks count
- If under limit → Invoice saved successfully
- If at limit → Error returned with upgrade prompt
- User can choose to upgrade or cancel

**Paid Plans:**
- Basic: 50 invoices
- Premium: 200 invoices
- Enterprise: Unlimited

### 4. Error Handling

**Subscription Limit Error (403):**
```
"You have reached your invoice limit. Would you like to upgrade your subscription?"
[Upgrade] [Cancel]
```

**Other Errors:**
```
"Error: [error message]"
```

## How It Works

### Save as Draft Flow

1. User fills invoice form
2. Clicks "Save as Draft"
3. Frontend collects all invoice data from Redux
4. Sends POST request to `/api/invoices` with status: 'draft'
5. Backend checks subscription limit
6. If allowed:
   - Creates invoice in database
   - Increments user's invoice count
   - Returns success with subscription info
7. Frontend shows success message with count
8. Invoice stays in draft state

### Save & Continue Flow

1. User fills invoice form
2. Clicks "Save & Continue"
3. Frontend collects all invoice data
4. Sends POST request with status: 'completed'
5. Backend checks subscription limit
6. If allowed:
   - Creates invoice in database
   - Increments count
   - Returns success
7. Frontend navigates to preview page
8. User can download/share invoice

### Subscription Limit Check

```javascript
// Backend checks before creating invoice
if (!subscription.canCreateInvoice()) {
  return 403 error with limit info
}

// If allowed, create invoice
const invoice = await Invoice.create(data);
await subscription.incrementInvoiceCount();
```

## Invoice Data Structure

The frontend sends complete invoice data:

```typescript
{
  templateType: 'invoice-generator',
  title: 'Invoice',
  subtitle: '',
  invoiceNo: 'INV-001',
  invoiceDate: '2024-01-15',
  dueDate: '2024-02-15',
  businessDetails: {
    vendorName: 'My Company',
    country: 'India',
    // ... more fields
  },
  clientDetails: {
    name: 'Client Name',
    company: 'Client Company',
    // ... more fields
  },
  items: [
    {
      name: 'Product 1',
      quantity: 2,
      rate: 1000,
      amount: 2000,
      // ... more fields
    }
  ],
  totals: {
    amount: 2000,
    sgst: 180,
    cgst: 180,
    grandTotal: 2360
  },
  status: 'draft' // or 'completed'
}
```

## Backend Response

### Success Response
```json
{
  "success": true,
  "message": "Invoice created successfully",
  "data": {
    "invoice": {
      "_id": "invoice_id",
      "invoiceNo": "INV-001",
      // ... full invoice data
    },
    "subscription": {
      "invoicesCreated": 3,
      "invoiceLimit": 5,
      "remainingInvoices": 2
    }
  }
}
```

### Limit Reached Error
```json
{
  "success": false,
  "message": "Invoice limit reached. Please upgrade your subscription.",
  "data": {
    "currentPlan": "free",
    "invoicesCreated": 5,
    "invoiceLimit": 5
  }
}
```

## Template Types

All templates use the same backend endpoint with different `templateType`:

1. `invoice-generator` - Standard invoice
2. `purchase-order` - Purchase order
3. `quotation` - Quotation/Estimate
4. `gst-invoice` - GST Invoice
5. `delivery-challan` - Delivery Challan
6. `proforma-invoice` - Proforma Invoice

## Applying to Other Templates

To add backend integration to other templates:

1. Import the hook:
```typescript
import { useInvoiceSave } from '@/hooks/useInvoiceSave';
```

2. Use in component:
```typescript
const { saving, error, saveAsDraft, saveAndContinue } = useInvoiceSave({
  templateType: 'quotation', // Change per template
  title,
  subtitle
});
```

3. Update button handlers:
```typescript
const handleSaveAsDraft = async () => {
  const result = await saveAsDraft();
  if (result?.success) {
    alert(`Saved! ${result.data.subscription.invoicesCreated}/${result.data.subscription.invoiceLimit} used`);
  }
};
```

4. Add loading state to buttons:
```typescript
<button onClick={handleSaveAsDraft} disabled={saving}>
  {saving ? 'Saving...' : 'Save as Draft'}
</button>
```

## Testing

### Test Case 1: First Invoice
1. Login as new user
2. Create invoice
3. Click "Save as Draft"
4. Should show: "Invoice saved! 1/5 invoices used"

### Test Case 2: Reaching Limit
1. Create 5 invoices
2. Try to create 6th invoice
3. Should show limit error
4. Should prompt to upgrade

### Test Case 3: After Upgrade
1. Upgrade to Basic plan
2. Create invoice
3. Should show: "Invoice saved! 6/50 invoices used"

### Test Case 4: Different Templates
1. Create invoice-generator
2. Create quotation
3. Create GST invoice
4. All should count toward same limit

## Dashboard Integration

Dashboard now shows:
- Last invoice created
- Last quotation created
- Subscription status
- Invoices used/remaining
- Warning when approaching limit

## Next Steps

1. Add invoice listing page
2. Add invoice edit functionality
3. Add invoice delete (decrements count)
4. Add PDF generation
5. Add email sharing
6. Add payment tracking
7. Add recurring invoices

## Troubleshooting

### Invoice not saving
- Check if user is logged in
- Check network tab for API errors
- Verify backend is running
- Check MongoDB connection

### Subscription limit not working
- Verify subscription model exists
- Check if subscription is created on signup
- Verify increment logic in backend

### Wrong invoice count
- Check if delete decrements count
- Verify subscription.invoicesCreated field
- Check for duplicate invoice creation

## API Endpoints Used

- `POST /api/invoices` - Create invoice
- `GET /api/invoices` - List invoices
- `GET /api/invoices/:id` - Get single invoice
- `GET /api/invoices/last/:templateType` - Get last invoice
- `GET /api/subscription` - Get subscription status
- `POST /api/subscription/upgrade` - Upgrade plan
