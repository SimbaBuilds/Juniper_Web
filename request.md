We are building out this web application with some additoinal features already present in the React Native mobile application

1. All auth flows and related functionality /Users/cameronhightower/Software_Projects/juniper_web/react_native_reference/src/integrations
    1.1 All integration infrastructure and service speciifc auth flows including but not limited to:
        1.1.2 “Let’s complete integration for <service_name>” with integration_in_progress flag for integration completion
        1.1.3 Health data edge function call on Oura and Fitbit callback

2. Image upload for chat /Users/cameronhightower/Software_Projects/juniper_web/react_native_reference/src/voice/components/TextChatInput.tsx


For task 1: there is a lot of code to copy, but both this web application and the React Native app are in Typescript so you could try using your bulk edit parsing tool or create a parsing script to speed up the copying process.  Make sure the callback routes for this web application don't overlap with the App Links and Universal Links routes in the mobile app as they use the domain of this web application.