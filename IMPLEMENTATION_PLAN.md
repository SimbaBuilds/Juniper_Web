# Request Status Polling & Cancellation Implementation Plan

## Overview
This plan implements request status polling and cancellation functionality for the NextJS web chat application, mirroring the sophisticated React Native implementation while leveraging the existing Supabase infrastructure.

## Existing Supabase Infrastructure Analysis

Your NextJS project already has the essential database infrastructure in place:

### Database Tables (Already Existing)
- **`requests`** table - Tracks request status (`pending`, `processing`, `completed`, `failed`, `cancelled`)  
- **`cancellation_requests`** table - Stores cancellation requests for processing
- **`conversations`** and **`messages`** tables - For chat history management

### Supabase Clients (Already Configured)
- **Browser Client** (`lib/utils/supabase/client.ts`) - For frontend operations
- **Server Client** (`lib/utils/supabase/server.ts`) - For API routes
- **Service Client** (`lib/utils/supabase/service.ts`) - For admin operations
- **Type Definitions** (`lib/utils/supabase/tables.ts`) - Complete TypeScript types

## Implementation Components

### 1. Database Service Layer (`lib/services/requestService.ts`)

Create a service that leverages your existing Supabase setup:

```typescript
interface RequestService {
  // Request management
  createRequest(userId: string, requestData: CreateRequestData): Promise<Request>
  getRequestStatus(requestId: string): Promise<string | null>
  updateRequestStatus(requestId: string, status: string, metadata?: Record<string, any>): Promise<Request>
  
  // Cancellation management  
  createCancellationRequest(userId: string, requestId: string): Promise<CancellationRequest>
  isCancellationRequested(requestId: string): Promise<boolean>
}
```

**Supabase Integration:**
- Uses your existing `createClient()` from `lib/utils/supabase/client.ts`
- Follows your established patterns from `ConversationHistory` component
- Utilizes your existing `Request` and `CancellationRequest` types
- Implements proper error handling matching your current error patterns

### 2. Request Status Polling Hook (`hooks/useRequestStatusPolling.ts`)

```typescript
interface UseRequestStatusPollingOptions {
  requestId: string | null;
  intervalMs?: number; // Default: 5000ms
  onStatusChange?: (status: string) => void;
}

export const useRequestStatusPolling = (options: UseRequestStatusPollingOptions) => {
  // Implementation mirrors React Native hook but uses your createClient()
  // Auto-stops polling on final states: completed, failed, cancelled
  // Returns: { status, error }
}
```

**Supabase Integration:**
- Uses browser client for real-time polling
- Follows same cleanup patterns as your existing `useEffect` hooks
- Integrates with your existing error handling via `toast` notifications

### 3. Enhanced Chat API Route (`app/api/chat/route.ts`)

Modify your existing API route to include request tracking:

**Current Flow:**
```
User Input → API Route → Python Backend → Response
```

**Enhanced Flow:**
```
User Input → API Route → Create Request Record → Python Backend → Update Status → Response
```

**Changes to Existing Code:**
- Add request record creation before backend call
- Include `request_id` in backend payload (already in your code!)
- Return `request_id` to frontend for polling
- Use your existing `createSupabaseAppServerClient()` function

### 4. Cancellation API Route (`app/api/chat/cancel/route.ts`)

New API route that integrates with your existing patterns:

```typescript
// Uses your existing server client pattern
const supabase = await createSupabaseAppServerClient()
const { data: { user }, error: authError } = await supabase.auth.getUser()

// Create cancellation request using your existing types
const cancellationRequest: Partial<CancellationRequest> = {
  user_id: user.id,
  request_id: requestId,
  request_type: 'chat',
  status: 'pending',
  metadata: { cancelled_at: new Date().toISOString() }
}
```

### 5. Frontend Integration

#### Enhanced ChatPage (`app/(protected)/chat/page.tsx`)

**Existing Patterns to Leverage:**
- Your `handleSendMessage` function structure
- Your `setIsLoading` state management 
- Your Supabase user authentication flow
- Your `toast` notification system

**New Additions:**
```typescript
// Add to existing state
const [currentRequestId, setCurrentRequestId] = useState<string | null>(null)
const [requestStatus, setRequestStatus] = useState<string | null>(null)
const abortControllerRef = useRef<AbortController | null>(null)

// Integrate polling hook
const { status: polledStatus } = useRequestStatusPolling({
  requestId: currentRequestId,
  onStatusChange: (status) => {
    setRequestStatus(status)
    if (['completed', 'failed', 'cancelled'].includes(status)) {
      setCurrentRequestId(null)
      setIsLoading(false)
    }
  }
})
```

#### Enhanced ChatMessage Component

**Current Structure Preserved:**
- Your existing `Message` interface
- Your markdown rendering with `ReactMarkdown`
- Your timestamp display logic
- Your styling with `cn()` utility

**New Status Indicators:**
```tsx
// Add status indicators for active requests
{isActiveRequest && (
  <div className="flex items-center gap-2 mt-2">
    {requestStatus === 'pending' && (
      <>
        <Loader2 className="h-3 w-3 animate-spin" />
        <span className="text-xs text-muted-foreground">Sending...</span>
      </>
    )}
    {requestStatus === 'processing' && (
      <>
        <Loader2 className="h-3 w-3 animate-spin" />
        <span className="text-xs text-muted-foreground">Thinking...</span>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onCancel}
          className="text-xs h-6 px-2"
        >
          Cancel
        </Button>
      </>
    )}
  </div>
)}
```

## Implementation Phases

### Phase 1: Core Infrastructure
1. **Create RequestService** - Database operations using existing Supabase clients
2. **Create useRequestStatusPolling hook** - Polling logic with cleanup
3. **Enhance chat API route** - Add request tracking to existing flow

### Phase 2: Cancellation System  
1. **Create cancellation API route** - New endpoint for cancel operations
2. **Add AbortController logic** - HTTP request cancellation in frontend
3. **Integrate cancellation UI** - Cancel buttons and status updates

### Phase 3: UI Enhancements
1. **Add status indicators** - Visual feedback for request states
2. **Enhance loading states** - Better UX during long operations  
3. **Add error handling** - Proper cancellation error messaging

## Key Integration Points with Existing Code

### Authentication Flow
- **Reuses your existing auth pattern:** `supabase.auth.getUser()`
- **Leverages your user state:** Already have user from `useEffect` in ChatPage
- **Maintains your session handling:** Uses existing session management

### Error Handling
- **Integrates with your toast system:** `toast.error()` for cancellation errors
- **Follows your error patterns:** Same error logging and user feedback
- **Preserves your loading states:** Works with existing `isLoading` state

### Data Flow
- **Extends your message flow:** Adds request tracking without disrupting chat
- **Uses your existing types:** Leverages `Message` interface and conversation storage
- **Maintains your backend integration:** Preserves FormData format to Python backend

### Styling and UI
- **Follows your component patterns:** Uses your button and icon components
- **Maintains your styling:** Integrates with your `cn()` utility and CSS classes  
- **Preserves your layout:** Fits within existing chat message structure

## Database Schema Requirements

Your existing schema already supports this implementation:

### Requests Table (✅ Already Exists)
```sql
-- Your existing Request type covers this
id, user_id, request_id, request_type, status, metadata, image_url, created_at, updated_at
```

### Cancellation Requests Table (✅ Already Exists) 
```sql
-- Your existing CancellationRequest type covers this
id, user_id, request_id, request_type, status, metadata, created_at, processed_at
```

## Benefits of This Approach

1. **Minimal Disruption:** Builds on your existing patterns without major rewrites
2. **Type Safety:** Leverages your existing TypeScript definitions  
3. **Consistent UX:** Matches your current chat interface and behavior
4. **Scalable:** Uses your established Supabase service layer
5. **Maintainable:** Follows your existing code organization and naming conventions

## Next Steps

1. **Review this plan** - Ensure it aligns with your preferences
2. **Implement Phase 1** - Core request tracking infrastructure  
3. **Test integration** - Verify polling works with your Python backend
4. **Add cancellation** - Phase 2 implementation with UI updates
5. **Polish UX** - Phase 3 enhancements for production ready experience

This implementation will give your NextJS web app the same sophisticated request management capabilities as your React Native app, while feeling native to your existing codebase and development patterns.