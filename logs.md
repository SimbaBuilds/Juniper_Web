 …}
_be6bb50b._.js:1839 [CHAT] Processing status change: {requestId: 'web-1758958135916-1yfq9nt57', newStatus: 'completed', previousStatus: null, timestamp: '2025-09-27T07:32:23.346Z'}
_be6bb50b._.js:1851 [CHAT] Request reached final state, clearing UI tracking: {requestId: 'web-1758958135916-1yfq9nt57', finalStatus: 'completed', timestamp: '2025-09-27T07:32:23.346Z'}
_be6bb50b._.js:1701 [CHAT] clearUIWithMinimumTime called: {loadingStartTime: null, currentTime: 1758958343347, hasLoadingStartTime: false, timestamp: '2025-09-27T07:32:23.347Z'}
_be6bb50b._.js:1710 [CHAT] No loading start time recorded, enforcing full minimum display time: {minimumTime: 2000, timestamp: '2025-09-27T07:32:23.347Z'}
page.tsx:633 [CHAT] Loading start time recorded: {requestId: 'web-1758958344362-in1yub7y3', loadingStartTime: 1758958344362, timestamp: '2025-09-27T07:32:24.362Z'}
page.tsx:639 [CHAT] Starting new request: {requestId: 'web-1758958344362-in1yub7y3', messageLength: 2, hasImage: false, conversationId: '09e2ddf6-f814-4963-aab8-171b27945b7e', timestamp: '2025-09-27T07:32:24.362Z'}
useRequestStatusPolling.ts:56 [POLLING_HOOK] Starting polling for request: {request_id: 'web-1758958344362-in1yub7y3', interval_ms: 5000, timestamp: '2025-09-27T07:32:24.384Z'}
page.tsx:261 [CHAT] Loading state changed: {previousIsLoading: false, newIsLoading: true, currentRequestId: 'web-1758958344362-in1yub7y3', requestStatus: 'pending', timestamp: '2025-09-27T07:32:24.385Z'}
page.tsx:275 [CHAT] Request ID changed: {previousRequestId: null, newRequestId: 'web-1758958344362-in1yub7y3', timestamp: '2025-09-27T07:32:24.385Z'}
useRequestStatusPolling.ts:56 [POLLING_HOOK] Starting polling for request: {request_id: 'web-1758958344362-in1yub7y3', interval_ms: 5000, timestamp: '2025-09-27T07:32:24.403Z'}
_be6bb50b._.js:1719 [CHAT] Minimum loading time timeout executed (no start time case): {delayUsed: 2000, timestamp: '2025-09-27T07:32:25.348Z'}
fetch.ts:15  GET https://ydbabipbxxleeiiysojv.supabase.co/rest/v1/requests?select=status%2Cuser_message%2Ctotal_turns%2Cconversation_id&request_id=eq.web-1758958344362-in1yub7y3 406 (Not Acceptable)
(anonymous) @ fetch.ts:15
(anonymous) @ fetch.ts:46
fulfilled @ fetch.ts:2
Promise.then
step @ fetch.ts:2
(anonymous) @ fetch.ts:2
push.[project]/node_modules/@supabase/supabase-js/dist/module/lib/fetch.js [app-client] (ecmascript).__awaiter @ fetch.ts:2
(anonymous) @ fetch.ts:34
then @ PostgrestBuilder.ts:101
setTimeout
useRequestStatusPolling.useEffect.startPolling @ useRequestStatusPolling.ts:68
useRequestStatusPolling.useEffect.startPolling @ useRequestStatusPolling.ts:68
useRequestStatusPolling.useEffect @ useRequestStatusPolling.ts:194
react-stack-bottom-frame @ react-dom-client.development.js:23054
runWithFiberInDEV @ react-dom-client.development.js:844
commitHookEffectListMount @ react-dom-client.development.js:11977
commitHookPassiveMountEffects @ react-dom-client.development.js:12098
commitPassiveMountOnFiber @ react-dom-client.development.js:13928
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:13921
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:14047
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:14047
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:13921
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:13931
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:13921
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:13921
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:13921
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:13921
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:13931
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:13921
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:13921
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:14047
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:13921
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:14047
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:14047
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:13921
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:13931
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:13921
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:13931
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:13921
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:13921
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:13921
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:13931
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:13921
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:13921
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:14047
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:13921
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:14047
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:14047
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:14047
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:14047
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:13921
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:13931
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:13921
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:13931
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:13921
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:13921
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:13921
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:13931
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:13921
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:13921
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:14047
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:13921
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:14047
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:13921
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:14047
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:13921
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:14047
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:14047
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:14047
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:13931
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:13921
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:13931
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:13921
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:13921
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:13931
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:13921
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:13921
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:14047
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:14047
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:14047
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:14047
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:14047
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:14047
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:13921
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:13931
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:13921
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:13921
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:14047
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:13921
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:13921
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:14047
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:14047
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:13940
flushPassiveEffects @ react-dom-client.development.js:15868
flushPendingEffects @ react-dom-client.development.js:15829
performSyncWorkOnRoot @ react-dom-client.development.js:16361
flushSyncWorkAcrossRoots_impl @ react-dom-client.development.js:16210
flushSpawnedWork @ react-dom-client.development.js:15804
commitRoot @ react-dom-client.development.js:15528
commitRootWhenReady @ react-dom-client.development.js:14758
performWorkOnRoot @ react-dom-client.development.js:14681
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:16349
performWorkUntilDeadline @ scheduler.development.js:45Understand this error
useRequestStatusPolling.ts:127 [POLLING_HOOK] Status changed: {request_id: 'web-1758958344362-in1yub7y3', previous_status: null, new_status: 'pending', user_message: null, total_turns: 0, …}
page.tsx:204 [CHAT] Status change received: {currentRequestId: 'web-1758958344362-in1yub7y3', pollingRequestId: 'web-1758958344362-in1yub7y3', status: 'pending', requestIdsMatch: true, isLoading: true, …}
page.tsx:225 [CHAT] Processing status change: {requestId: 'web-1758958344362-in1yub7y3', newStatus: 'pending', previousStatus: null, timestamp: '2025-09-27T07:32:26.726Z'}
useRequestStatusPolling.ts:56 [POLLING_HOOK] Starting polling for request: {request_id: 'web-1758958344362-in1yub7y3', interval_ms: 5000, timestamp: '2025-09-27T07:32:26.844Z'}
_be6bb50b._.js:1820 [CHAT] Status change received: {currentRequestId: 'web-1758958135916-1yfq9nt57', pollingRequestId: 'web-1758958135916-1yfq9nt57', status: 'completed', requestIdsMatch: true, isLoading: true, …}
_be6bb50b._.js:1839 [CHAT] Processing status change: {requestId: 'web-1758958135916-1yfq9nt57', newStatus: 'completed', previousStatus: null, timestamp: '2025-09-27T07:32:28.329Z'}
_be6bb50b._.js:1851 [CHAT] Request reached final state, clearing UI tracking: {requestId: 'web-1758958135916-1yfq9nt57', finalStatus: 'completed', timestamp: '2025-09-27T07:32:28.329Z'}
_be6bb50b._.js:1701 [CHAT] clearUIWithMinimumTime called: {loadingStartTime: null, currentTime: 1758958348329, hasLoadingStartTime: false, timestamp: '2025-09-27T07:32:28.329Z'}
_be6bb50b._.js:1710 [CHAT] No loading start time recorded, enforcing full minimum display time: {minimumTime: 2000, timestamp: '2025-09-27T07:32:28.329Z'}
useRequestStatusPolling.ts:127 [POLLING_HOOK] Status changed: {request_id: 'web-1758958344362-in1yub7y3', previous_status: 'pending', new_status: 'thinking', user_message: 'hi', total_turns: 0, …}
page.tsx:204 [CHAT] Status change received: {currentRequestId: 'web-1758958344362-in1yub7y3', pollingRequestId: 'web-1758958344362-in1yub7y3', status: 'thinking', requestIdsMatch: true, isLoading: true, …}
page.tsx:225 [CHAT] Processing status change: {requestId: 'web-1758958344362-in1yub7y3', newStatus: 'thinking', previousStatus: 'pending', timestamp: '2025-09-27T07:32:28.951Z'}
useRequestStatusPolling.ts:56 [POLLING_HOOK] Starting polling for request: {request_id: 'web-1758958344362-in1yub7y3', interval_ms: 5000, timestamp: '2025-09-27T07:32:29.070Z'}
_be6bb50b._.js:1719 [CHAT] Minimum loading time timeout executed (no start time case): {delayUsed: 2000, timestamp: '2025-09-27T07:32:30.329Z'}
page.tsx:204 [CHAT] Status change received: {currentRequestId: 'web-1758958344362-in1yub7y3', pollingRequestId: 'web-1758958344362-in1yub7y3', status: 'thinking', requestIdsMatch: true, isLoading: true, …}
page.tsx:225 [CHAT] Processing status change: {requestId: 'web-1758958344362-in1yub7y3', newStatus: 'thinking', previousStatus: 'thinking', timestamp: '2025-09-27T07:32:31.184Z'}
page.tsx:204 [CHAT] Status change received: {currentRequestId: 'web-1758958344362-in1yub7y3', pollingRequestId: 'web-1758958344362-in1yub7y3', status: 'thinking', requestIdsMatch: true, isLoading: true, …}
page.tsx:225 [CHAT] Processing status change: {requestId: 'web-1758958344362-in1yub7y3', newStatus: 'thinking', previousStatus: 'thinking', timestamp: '2025-09-27T07:32:31.703Z'}
_be6bb50b._.js:1820 [CHAT] Status change received: {currentRequestId: 'web-1758958135916-1yfq9nt57', pollingRequestId: 'web-1758958135916-1yfq9nt57', status: 'completed', requestIdsMatch: true, isLoading: true, …}
_be6bb50b._.js:1839 [CHAT] Processing status change: {requestId: 'web-1758958135916-1yfq9nt57', newStatus: 'completed', previousStatus: null, timestamp: '2025-09-27T07:32:33.333Z'}
_be6bb50b._.js:1851 [CHAT] Request reached final state, clearing UI tracking: {requestId: 'web-1758958135916-1yfq9nt57', finalStatus: 'completed', timestamp: '2025-09-27T07:32:33.333Z'}
_be6bb50b._.js:1701 [CHAT] clearUIWithMinimumTime called: {loadingStartTime: null, currentTime: 1758958353333, hasLoadingStartTime: false, timestamp: '2025-09-27T07:32:33.333Z'}
_be6bb50b._.js:1710 [CHAT] No loading start time recorded, enforcing full minimum display time: {minimumTime: 2000, timestamp: '2025-09-27T07:32:33.333Z'}
page.tsx:672 [CHAT] Request completed successfully: {requestId: 'web-1758958344362-in1yub7y3', responseLength: 209, timestamp: '2025-09-27T07:32:34.014Z'}
useRequestStatusPolling.ts:56 [POLLING_HOOK] Starting polling for request: {request_id: 'web-1758958344362-in1yub7y3', interval_ms: 5000, timestamp: '2025-09-27T07:32:34.130Z'}
_be6bb50b._.js:1719 [CHAT] Minimum loading time timeout executed (no start time case): {delayUsed: 2000, timestamp: '2025-09-27T07:32:35.334Z'}
useRequestStatusPolling.ts:127 [POLLING_HOOK] Status changed: {request_id: 'web-1758958344362-in1yub7y3', previous_status: 'thinking', new_status: 'completed', user_message: 'hi', total_turns: 0, …}
page.tsx:204 [CHAT] Status change received: {currentRequestId: 'web-1758958344362-in1yub7y3', pollingRequestId: 'web-1758958344362-in1yub7y3', status: 'completed', requestIdsMatch: true, isLoading: true, …}
page.tsx:225 [CHAT] Processing status change: {requestId: 'web-1758958344362-in1yub7y3', newStatus: 'completed', previousStatus: 'thinking', timestamp: '2025-09-27T07:32:36.231Z'}
page.tsx:239 [CHAT] Request reached final state, clearing UI tracking: {requestId: 'web-1758958344362-in1yub7y3', finalStatus: 'completed', timestamp: '2025-09-27T07:32:36.232Z'}
page.tsx:61 [CHAT] clearUIWithMinimumTime called: {requestId: 'web-1758958344362-in1yub7y3', loadingStartTime: 1758958344362, currentTime: 1758958356232, hasLoadingStartTime: true, timestamp: '2025-09-27T07:32:36.232Z'}
page.tsx:146 [CHAT] Minimum time already elapsed, clearing immediately: {requestId: 'web-1758958344362-in1yub7y3', elapsedTime: 11870, timestamp: '2025-09-27T07:32:36.232Z'}
useRequestStatusPolling.ts:157 [POLLING_HOOK] Stopping polling - final state reached: {request_id: 'web-1758958344362-in1yub7y3', final_status: 'completed', total_turns: 0, was_already_complete_on_first_poll: true, note: 'Request completed before polling started (within 2s delay)', …}
useRequestStatusPolling.ts:127 [POLLING_HOOK] Status changed: {request_id: 'web-1758958344362-in1yub7y3', previous_status: null, new_status: 'completed', user_message: 'hi', total_turns: 0, …}
page.tsx:204 [CHAT] Status change received: {currentRequestId: 'web-1758958344362-in1yub7y3', pollingRequestId: 'web-1758958344362-in1yub7y3', status: 'completed', requestIdsMatch: true, isLoading: true, …}
page.tsx:225 [CHAT] Processing status change: {requestId: 'web-1758958344362-in1yub7y3', newStatus: 'completed', previousStatus: null, timestamp: '2025-09-27T07:32:36.716Z'}
page.tsx:239 [CHAT] Request reached final state, clearing UI tracking: {requestId: 'web-1758958344362-in1yub7y3', finalStatus: 'completed', timestamp: '2025-09-27T07:32:36.716Z'}
page.tsx:61 [CHAT] clearUIWithMinimumTime called: {requestId: 'web-1758958344362-in1yub7y3', loadingStartTime: undefined, currentTime: 1758958356717, hasLoadingStartTime: false, timestamp: '2025-09-27T07:32:36.717Z'}
page.tsx:72 [CHAT] No loading start time recorded, enforcing full minimum display time: {requestId: 'web-1758958344362-in1yub7y3', minimumTime: 2000, timestamp: '2025-09-27T07:32:36.717Z'}
useRequestStatusPolling.ts:157 [POLLING_HOOK] Stopping polling - final state reached: {request_id: 'web-1758958344362-in1yub7y3', final_status: 'completed', total_turns: 0, was_already_complete_on_first_poll: true, note: 'Request completed before polling started (within 2s delay)', …}
_be6bb50b._.js:1820 [CHAT] Status change received: {currentRequestId: 'web-1758958135916-1yfq9nt57', pollingRequestId: 'web-1758958135916-1yfq9nt57', status: 'completed', requestIdsMatch: true, isLoading: true, …}
_be6bb50b._.js:1839 [CHAT] Processing status change: {requestId: 'web-1758958135916-1yfq9nt57', newStatus: 'completed', previousStatus: null, timestamp: '2025-09-27T07:32:38.317Z'}
_be6bb50b._.js:1851 [CHAT] Request reached final state, clearing UI tracking: {requestId: 'web-1758958135916-1yfq9nt57', finalStatus: 'completed', timestamp: '2025-09-27T07:32:38.317Z'}
_be6bb50b._.js:1701 [CHAT] clearUIWithMinimumTime called: {loadingStartTime: null, currentTime: 1758958358317, hasLoadingStartTime: false, timestamp: '2025-09-27T07:32:38.317Z'}
_be6bb50b._.js:1710 [CHAT] No loading start time recorded, enforcing full minimum display time: {minimumTime: 2000, timestamp: '2025-09-27T07:32:38.317Z'}
page.tsx:85 [CHAT] Minimum loading time timeout executed (no start time case): {requestId: 'web-1758958344362-in1yub7y3', delayUsed: 2000, timestamp: '2025-09-27T07:32:38.718Z'}
_be6bb50b._.js:1719 [CHAT] Minimum loading time timeout executed (no start time case): {delayUsed: 2000, timestamp: '2025-09-27T07:32:40.319Z'}
useRequestStatusPolling.ts:127 [POLLING_HOOK] Status changed: {request_id: 'web-1758958344362-in1yub7y3', previous_status: null, new_status: 'completed', user_message: 'hi', total_turns: 0, …}
page.tsx:204 [CHAT] Status change received: {currentRequestId: 'web-1758958344362-in1yub7y3', pollingRequestId: 'web-1758958344362-in1yub7y3', status: 'completed', requestIdsMatch: true, isLoading: true, …}
page.tsx:225 [CHAT] Processing status change: {requestId: 'web-1758958344362-in1yub7y3', newStatus: 'completed', previousStatus: null, timestamp: '2025-09-27T07:32:41.793Z'}
page.tsx:239 [CHAT] Request reached final state, clearing UI tracking: {requestId: 'web-1758958344362-in1yub7y3', finalStatus: 'completed', timestamp: '2025-09-27T07:32:41.793Z'}
page.tsx:61 [CHAT] clearUIWithMinimumTime called: {requestId: 'web-1758958344362-in1yub7y3', loadingStartTime: undefined, currentTime: 1758958361793, hasLoadingStartTime: false, timestamp: '2025-09-27T07:32:41.793Z'}
page.tsx:72 [CHAT] No loading start time recorded, enforcing full minimum display time: {requestId: 'web-1758958344362-in1yub7y3', minimumTime: 2000, timestamp: '2025-09-27T07:32:41.793Z'}
useRequestStatusPolling.ts:157 [POLLING_HOOK] Stopping polling - final state reached: {request_id: 'web-1758958344362-in1yub7y3', final_status: 'completed', total_turns: 0, was_already_complete_on_first_poll: true, note: 'Request completed before polling started (within 2s delay)', …}
_be6bb50b._.js:1820 [CHAT] Status change received: {currentRequestId: 'web-1758958135916-1yfq9nt57', pollingRequestId: 'web-1758958135916-1yfq9nt57', status: 'completed', requestIdsMatch: true, isLoading: true, …}
_be6bb50b._.js:1839 [CHAT] Processing status change: {requestId: 'web-1758958135916-1yfq9nt57', newStatus: 'completed', previousStatus: null, timestamp: '2025-09-27T07:32:43.321Z'}
_be6bb50b._.js:1851 [CHAT] Request reached final state, clearing UI tracking: {requestId: 'web-1758958135916-1yfq9nt57', finalStatus: 'completed', timestamp: '2025-09-27T07:32:43.321Z'}
_be6bb50b._.js:1701 [CHAT] clearUIWithMinimumTime called: {loadingStartTime: null, currentTime: 1758958363321, hasLoadingStartTime: false, timestamp: '2025-09-27T07:32:43.321Z'}
_be6bb50b._.js:1710 [CHAT] No loading start time recorded, enforcing full minimum display time: {minimumTime: 2000, timestamp: '2025-09-27T07:32:43.321Z'}
page.tsx:85 [CHAT] Minimum loading time timeout executed (no start time case): {requestId: 'web-1758958344362-in1yub7y3', delayUsed: 2000, timestamp: '2025-09-27T07:32:43.794Z'}
_be6bb50b._.js:1719 [CHAT] Minimum loading time timeout executed (no start time case): {delayUsed: 2000, timestamp: '2025-09-27T07:32:45.323Z'}
useRequestStatusPolling.ts:127 [POLLING_HOOK] Status changed: {request_id: 'web-1758958344362-in1yub7y3', previous_status: null, new_status: 'completed', user_message: 'hi', total_turns: 0, …}
page.tsx:204 [CHAT] Status change received: {currentRequestId: 'web-1758958344362-in1yub7y3', pollingRequestId: 'web-1758958344362-in1yub7y3', status: 'completed', requestIdsMatch: true, isLoading: true, …}
page.tsx:225 [CHAT] Processing status change: {requestId: 'web-1758958344362-in1yub7y3', newStatus: 'completed', previousStatus: null, timestamp: '2025-09-27T07:32:46.722Z'}
page.tsx:239 [CHAT] Request reached final state, clearing UI tracking: {requestId: 'web-1758958344362-in1yub7y3', finalStatus: 'completed', timestamp: '2025-09-27T07:32:46.723Z'}
page.tsx:61 [CHAT] clearUIWithMinimumTime called: {requestId: 'web-1758958344362-in1yub7y3', loadingStartTime: undefined, currentTime: 1758958366723, hasLoadingStartTime: false, timestamp: '2025-09-27T07:32:46.723Z'}
page.tsx:72 [CHAT] No loading start time recorded, enforcing full minimum display time: {requestId: 'web-1758958344362-in1yub7y3', minimumTime: 2000, timestamp: '2025-09-27T07:32:46.723Z'}
useRequestStatusPolling.ts:157 [POLLING_HOOK] Stopping polling - final state reached: {request_id: 'web-1758958344362-in1yub7y3', final_status: 'completed', total_turns: 0, was_already_complete_on_first_poll: true, note: 'Request completed before polling started (within 2s delay)', …}
_be6bb50b._.js:1820 [CHAT] Status change received: {currentRequestId: 'web-1758958135916-1yfq9nt57', pollingRequestId: 'web-1758958135916-1yfq9nt57', status: 'completed', requestIdsMatch: true, isLoading: true, …}
_be6bb50b._.js:1839 [CHAT] Processing status change: {requestId: 'web-1758958135916-1yfq9nt57', newStatus: 'completed', previousStatus: null, timestamp: '2025-09-27T07:32:48.325Z'}
_be6bb50b._.js:1851 [CHAT] Request reached final state, clearing UI tracking: {requestId: 'web-1758958135916-1yfq9nt57', finalStatus: 'completed', timestamp: '2025-09-27T07:32:48.325Z'}
_be6bb50b._.js:1701 [CHAT] clearUIWithMinimumTime called: {loadingStartTime: null, currentTime: 1758958368325, hasLoadingStartTime: false, timestamp: '2025-09-27T07:32:48.325Z'}
_be6bb50b._.js:1710 [CHAT] No loading start time recorded, enforcing full minimum display time: {minimumTime: 2000, timestamp: '2025-09-27T07:32:48.325Z'}
page.tsx:85 [CHAT] Minimum loading time timeout executed (no start time case): {requestId: 'web-1758958344362-in1yub7y3', delayUsed: 2000, timestamp: '2025-09-27T07:32:48.725Z'}
_be6bb50b._.js:1719 [CHAT] Minimum loading time timeout executed (no start time case): {delayUsed: 2000, timestamp: '2025-09-27T07:32:50.327Z'}
useRequestStatusPolling.ts:127 [POLLING_HOOK] Status changed: {request_id: 'web-1758958344362-in1yub7y3', previous_status: null, new_status: 'completed', user_message: 'hi', total_turns: 0, …}
page.tsx:204 [CHAT] Status change received: {currentRequestId: 'web-1758958344362-in1yub7y3', pollingRequestId: 'web-1758958344362-in1yub7y3', status: 'completed', requestIdsMatch: true, isLoading: true, …}
page.tsx:225 [CHAT] Processing status change: {requestId: 'web-1758958344362-in1yub7y3', newStatus: 'completed', previousStatus: null, timestamp: '2025-09-27T07:32:51.718Z'}
page.tsx:239 [CHAT] Request reached final state, clearing UI tracking: {requestId: 'web-1758958344362-in1yub7y3', finalStatus: 'completed', timestamp: '2025-09-27T07:32:51.718Z'}
page.tsx:61 [CHAT] clearUIWithMinimumTime called: {requestId: 'web-1758958344362-in1yub7y3', loadingStartTime: undefined, currentTime: 1758958371719, hasLoadingStartTime: false, timestamp: '2025-09-27T07:32:51.719Z'}
page.tsx:72 [CHAT] No loading start time recorded, enforcing full minimum display time: {requestId: 'web-1758958344362-in1yub7y3', minimumTime: 2000, timestamp: '2025-09-27T07:32:51.719Z'}
useRequestStatusPolling.ts:157 [POLLING_HOOK] Stopping polling - final state reached: {request_id: 'web-1758958344362-in1yub7y3', final_status: 'completed', total_turns: 0, was_already_complete_on_first_poll: true, note: 'Request completed before polling started (within 2s delay)', …}
_be6bb50b._.js:1820 [CHAT] Status change received: {currentRequestId: 'web-1758958135916-1yfq9nt57', pollingRequestId: 'web-1758958135916-1yfq9nt57', status: 'completed', requestIdsMatch: true, isLoading: true, …}
_be6bb50b._.js:1839 [CHAT] Processing status change: {requestId: 'web-1758958135916-1yfq9nt57', newStatus: 'completed', previousStatus: null, timestamp: '2025-09-27T07:32:53.368Z'}
_be6bb50b._.js:1851 [CHAT] Request reached final state, clearing UI tracking: {requestId: 'web-1758958135916-1yfq9nt57', finalStatus: 'completed', timestamp: '2025-09-27T07:32:53.368Z'}
_be6bb50b._.js:1701 [CHAT] clearUIWithMinimumTime called: {loadingStartTime: null, currentTime: 1758958373368, hasLoadingStartTime: false, timestamp: '2025-09-27T07:32:53.368Z'}
_be6bb50b._.js:1710 [CHAT] No loading start time recorded, enforcing full minimum display time: {minimumTime: 2000, timestamp: '2025-09-27T07:32:53.368Z'}
page.tsx:85 [CHAT] Minimum loading time timeout executed (no start time case): {requestId: 'web-1758958344362-in1yub7y3', delayUsed: 2000, timestamp: '2025-09-27T07:32:53.721Z'}
_be6bb50b._.js:1719 [CHAT] Minimum loading time timeout executed (no start time case): {delayUsed: 2000, timestamp: '2025-09-27T07:32:55.480Z'}
useRequestStatusPolling.ts:127 [POLLING_HOOK] Status changed: {request_id: 'web-1758958344362-in1yub7y3', previous_status: null, new_status: 'completed', user_message: 'hi', total_turns: 0, …}
page.tsx:204 [CHAT] Status change received: {currentRequestId: 'web-1758958344362-in1yub7y3', pollingRequestId: 'web-1758958344362-in1yub7y3', status: 'completed', requestIdsMatch: true, isLoading: true, …}
page.tsx:225 [CHAT] Processing status change: {requestId: 'web-1758958344362-in1yub7y3', newStatus: 'completed', previousStatus: null, timestamp: '2025-09-27T07:32:56.752Z'}
page.tsx:239 [CHAT] Request reached final state, clearing UI tracking: {requestId: 'web-1758958344362-in1yub7y3', finalStatus: 'completed', timestamp: '2025-09-27T07:32:56.752Z'}
page.tsx:61 [CHAT] clearUIWithMinimumTime called: {requestId: 'web-1758958344362-in1yub7y3', loadingStartTime: undefined, currentTime: 1758958376752, hasLoadingStartTime: false, timestamp: '2025-09-27T07:32:56.752Z'}
page.tsx:72 [CHAT] No loading start time recorded, enforcing full minimum display time: {requestId: 'web-1758958344362-in1yub7y3', minimumTime: 2000, timestamp: '2025-09-27T07:32:56.752Z'}
useRequestStatusPolling.ts:157 [POLLING_HOOK] Stopping polling - final state reached: {request_id: 'web-1758958344362-in1yub7y3', final_status: 'completed', total_turns: 0, was_already_complete_on_first_poll: true, note: 'Request completed before polling started (within 2s delay)', …}
page.tsx:633 [CHAT] Loading start time recorded: {requestId: 'web-1758958378042-11jjtpgio', loadingStartTime: 1758958378042, timestamp: '2025-09-27T07:32:58.042Z'}
page.tsx:639 [CHAT] Starting new request: {requestId: 'web-1758958378042-11jjtpgio', messageLength: 35, hasImage: false, conversationId: '09e2ddf6-f814-4963-aab8-171b27945b7e', timestamp: '2025-09-27T07:32:58.043Z'}
useRequestStatusPolling.ts:56 [POLLING_HOOK] Starting polling for request: {request_id: 'web-1758958378042-11jjtpgio', interval_ms: 5000, timestamp: '2025-09-27T07:32:58.067Z'}
page.tsx:261 [CHAT] Loading state changed: {previousIsLoading: false, newIsLoading: true, currentRequestId: 'web-1758958378042-11jjtpgio', requestStatus: 'pending', timestamp: '2025-09-27T07:32:58.068Z'}
page.tsx:275 [CHAT] Request ID changed: {previousRequestId: null, newRequestId: 'web-1758958378042-11jjtpgio', timestamp: '2025-09-27T07:32:58.068Z'}
useRequestStatusPolling.ts:56 [POLLING_HOOK] Starting polling for request: {request_id: 'web-1758958378042-11jjtpgio', interval_ms: 5000, timestamp: '2025-09-27T07:32:58.086Z'}
_be6bb50b._.js:1820 [CHAT] Status change received: {currentRequestId: 'web-1758958135916-1yfq9nt57', pollingRequestId: 'web-1758958135916-1yfq9nt57', status: 'completed', requestIdsMatch: true, isLoading: true, …}
_be6bb50b._.js:1839 [CHAT] Processing status change: {requestId: 'web-1758958135916-1yfq9nt57', newStatus: 'completed', previousStatus: null, timestamp: '2025-09-27T07:32:58.329Z'}
_be6bb50b._.js:1851 [CHAT] Request reached final state, clearing UI tracking: {requestId: 'web-1758958135916-1yfq9nt57', finalStatus: 'completed', timestamp: '2025-09-27T07:32:58.329Z'}
_be6bb50b._.js:1701 [CHAT] clearUIWithMinimumTime called: {loadingStartTime: null, currentTime: 1758958378329, hasLoadingStartTime: false, timestamp: '2025-09-27T07:32:58.329Z'}
_be6bb50b._.js:1710 [CHAT] No loading start time recorded, enforcing full minimum display time: {minimumTime: 2000, timestamp: '2025-09-27T07:32:58.329Z'}
page.tsx:85 [CHAT] Minimum loading time timeout executed (no start time case): {requestId: 'web-1758958344362-in1yub7y3', delayUsed: 2000, timestamp: '2025-09-27T07:32:58.755Z'}
useRequestStatusPolling.ts:127 [POLLING_HOOK] Status changed: {request_id: 'web-1758958378042-11jjtpgio', previous_status: null, new_status: 'thinking', user_message: 'Updates from the white house today?', total_turns: 0, …}
page.tsx:204 [CHAT] Status change received: {currentRequestId: 'web-1758958378042-11jjtpgio', pollingRequestId: 'web-1758958378042-11jjtpgio', status: 'thinking', requestIdsMatch: true, isLoading: true, …}
page.tsx:225 [CHAT] Processing status change: {requestId: 'web-1758958378042-11jjtpgio', newStatus: 'thinking', previousStatus: null, timestamp: '2025-09-27T07:33:00.245Z'}
_be6bb50b._.js:1719 [CHAT] Minimum loading time timeout executed (no start time case): {delayUsed: 2000, timestamp: '2025-09-27T07:33:00.473Z'}
useRequestStatusPolling.ts:127 [POLLING_HOOK] Status changed: {request_id: 'web-1758958378042-11jjtpgio', previous_status: null, new_status: 'thinking', user_message: 'Updates from the white house today?', total_turns: 0, …}
page.tsx:204 [CHAT] Status change received: {currentRequestId: 'web-1758958378042-11jjtpgio', pollingRequestId: 'web-1758958378042-11jjtpgio', status: 'thinking', requestIdsMatch: true, isLoading: true, …}
page.tsx:225 [CHAT] Processing status change: {requestId: 'web-1758958378042-11jjtpgio', newStatus: 'thinking', previousStatus: 'thinking', timestamp: '2025-09-27T07:33:00.473Z'}
useRequestStatusPolling.ts:127 [POLLING_HOOK] Status changed: {request_id: 'web-1758958344362-in1yub7y3', previous_status: null, new_status: 'completed', user_message: 'hi', total_turns: 0, …}
