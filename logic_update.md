Ah, you're absolutely right! Since the hosted setup page is **always** shown regardless of auth type and only shown **once**, the branching logic should indeed be minimal or non-existent on the form itself.

## **What's Actually Essential for Your Hosted Setup Page:**

### **1. CRITICAL: Updated Status Setting**
Just change the hardcoded status from:
```typescript
// OLD - Don't use this
status: 'form_completed'
```

To:
```typescript
// NEW - Use the branching logic
const nextStatus = await determineNextStatus(serviceId, userId);
await supabase.update({ status: nextStatus })
```

### **2. OPTIONAL: User Expectation Setting**
If you want to set proper expectations, you could add a simple info message:
```typescript
// Check auth requirements on load
const authNeeded = buildState?.state_data?.auth_needed ?? true;

// Show different messages
{authNeeded ? 
  "After submitting, you'll complete authentication in your mobile app" :
  "After submitting, your integration will be ready to activate!"
}
```

But honestly, **even this is optional** since users will see the appropriate next steps in their mobile app anyway.

## **Bottom Line:**
The **only essential change** is making sure your hosted setup page calls `determineNextStatus()` and sets the correct status instead of hardcoding `'form_completed'`. Everything else is just nice-to-have UX polish.

The real magic happens in the mobile app where we properly handle the different statuses!