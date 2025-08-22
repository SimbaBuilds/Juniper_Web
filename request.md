We are implementing a basic onboarding message for new users.

Message:  
Welcome to Juniper! 🎉
Hi there! I'm Juniper, your AI wellness and productivity companion. Together with my specialized agent team, we can help optimize your daily life - from tracking your health metrics to drafting and sending emails in your unique voice, to creating smart automations that keep everything running smoothly.
What would you like to get started with today? If you aren't sure, starting with an integration is a great way to learn about what we can accomplish together.


Logic:
- Local storage "has_conversation_history" boolean: if true, display the message
- If no local storage, fallback to db logic: if no conversation records with user_id, display the message

Display: Message should be displayed in the chat component as a normal assistant message.

