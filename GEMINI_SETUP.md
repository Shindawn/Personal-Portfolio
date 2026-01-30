# Gemini AI Chatbot Integration Guide

## Setup Complete!

Your portfolio now has a fully functional AI chatbot powered by Google's Gemini API.

## What Was Fixed

1. **Created Missing Hook** - Added `src/hooks/useChat.ts` for managing chat state and messages
2. **Fixed API Endpoint** - Updated Gemini API URL to use the correct `v1beta` endpoint format
3. **Created TypingIndicator** - Added `src/components/chat/TypingIndicator.tsx` for visual loading state
4. **Added CSS Styles** - Included chat-specific CSS variables and animations
5. **Configured Environment** - Set up `.env` file with API key

## How It Works

### Architecture
- **useChat Hook**: Manages messages and loading states
- **geminiService**: Handles API calls with intelligent fallback Q&A
- **ChatWidget**: Main UI component with messages display and input
- **Smart Fallback**: If API fails, uses keyword-based responses about Lescy

### API Configuration

The chatbot uses the **FREE** Gemini 1.5 Flash API with these settings:
- **Model**: `gemini-1.5-flash-latest`
- **Temperature**: 0.7 (balanced creativity)
- **Max Tokens**: 300 (concise responses)
- **Context**: Full profile information about Lescy

### Environment Variables

Your `.env` file contains (client):
```
VITE_GEMINI_API_KEY=AIzaSyCNJJKTgpobS2s9N9PMssca0POvW1GAVXA
VITE_CHAT_FUNCTION_URL=https://<your-supabase>.functions.supabase.co/chat
```

Your serverless function requires (set in Supabase / server env):
```
GEMINI_API_KEY=<your-gemini-api-key>
# Optional short project summary (one-line-per-project). Use for richer chat answers.
PROJECTS_SUMMARY="Portfolio Website: Personal site built with React; PSC9 Pitch Deck: Capstone presentation; ..."
```

## Getting Your Own API Key

1. Visit [Google AI Studio](https://ai.google.dev)
2. Click "Get API Key"
3. Create a new API key (it's FREE!)
4. Replace the key in `.env` file

## Features

- Real-time AI responses
- Smart fallback system with keyword matching
- Beautiful typing indicator
- Dark mode support
- Responsive design
- Maintains conversation context

## Testing the Chatbot

1. Click the chat icon in the bottom-right corner
2. Try these questions:
   - "Hi, who are you?"
   - "What are your skills?"
   - "Tell me about your projects"
   - "Are you looking for internships?"

## Troubleshooting

### If chatbot doesn't respond:
1. Check browser console for errors
2. Verify API key in `.env` file
3. Ensure `.env` variables start with `VITE_`
4. Restart dev server after changing `.env`

### If you see fallback responses:
- This means the API call failed
- Check your API key validity
- Verify internet connection
- Check API quota (free tier has limits)

## API Limits (Free Tier)

- 15 requests per minute
- 1,500 requests per day
- 1 million tokens per day

These limits are generous for a portfolio site!

## Customization

### Change Response Style
Edit the `LESCY_CONTEXT` in `src/services/geminiService.ts`

### Add More Fallback Q&A
Update `fallbackQA` array in `src/services/geminiService.ts`

### Modify Temperature (Creativity)
Adjust `temperature` in `generationConfig` (0.0 = precise, 1.0 = creative)

### Change Max Response Length
Modify `maxOutputTokens` in `generationConfig`

## Files Modified/Created

- `/src/hooks/useChat.ts` - NEW
- `/src/components/chat/TypingIndicator.tsx` - NEW
- `/src/services/geminiService.ts` - UPDATED
- `/src/index.css` - UPDATED
- `/.env` - UPDATED

## Success!

Your chatbot is now fully functional and ready to answer questions about Lescy's portfolio, skills, and experience!
