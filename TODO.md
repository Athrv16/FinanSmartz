# TODO: Implement Persistent Chat History for Assistant Chatbot

## Overview
Add database persistence for chat messages in the AssistantChat component, ensuring history is saved per logged-in user and can be deleted on request.

## Steps to Complete

### 1. Update Prisma Schema
- Add a new `ChatMessage` model to `prisma/schema.prisma` with fields: id, userId, role, content, createdAt.
- Establish relation to User model.

### 2. Run Prisma Migration
- Generate Prisma client (completed).
- Create and run migration to update the database schema (completed).

### 3. Create API Routes for Chat History
- Create `app/api/assistant/history/route.js` for:
  - GET: Fetch chat messages for the authenticated user.
  - POST: Save a new chat message.
  - DELETE: Clear all chat history for the user.
- Add Clerk authentication to these routes (completed).

### 4. Update AssistantChat Component
- Modify `components/AssistantChat.jsx` to:
  - Load chat history on component mount using the new API.
  - Save new messages (user and assistant) to the database via API.
  - Add a "Delete All History" button that calls the DELETE API and clears local state.
- Use Clerk's `useUser` hook to get the current user ID (completed).

### 5. Update Assistant API Route
- Modify `app/api/assistant/route.js` to save assistant responses to the database after generating them (completed).

### 6. Testing
- Test loading history on page load.
- Test sending messages and verifying they are saved.
- Test deleting history and confirming it's cleared.
- Ensure only logged-in users can access history.

## Dependent Files
- `prisma/schema.prisma`
- `app/api/assistant/route.js`
- `app/api/assistant/history/route.js` (new)
- `components/AssistantChat.jsx`

## Followup Steps
- After implementation, run the app and verify functionality.
- If issues arise, debug API calls and database queries.
