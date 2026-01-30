Deployment steps for Vercel (GitHub integration)

1) Connect repo to Vercel
   - Go to https://vercel.com/import and choose your GitHub repository.
   - Set the framework preset to "Other" or "Vite".
   - Build command: `npm run build`
   - Output directory: `dist`

2) Environment variables
   - Add `VITE_CHAT_FUNCTION_URL` to Vercel (Preview & Production). This is safe to expose to the client.
     Example: `https://<your-supabase-project>.functions.supabase.co/chat`
   - If you host the chat function on Vercel serverless, add `GEMINI_API_KEY` (no `VITE_` prefix) in Vercel Project Settings → Environment Variables. Set it for Production scope only if possible.

3) Optional: configure GitHub Actions secret for automatic deploy
   - Add repository secrets: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`.
   - With those set, the GitHub Action `vercel-deploy` will automatically deploy on pushes to `main`.

4) Test
   - Push to `main` and check Vercel dashboard for deployment.
   - Verify the chat UI calls `VITE_CHAT_FUNCTION_URL` and the function returns a valid `response` value.

5) Security
   - Do not commit secrets or `*.local` files. Keep secrets in Vercel or Supabase function envs.
   - Consider rotating keys periodically and use least-privilege tokens.

If you want, I can add the Vercel project secrets for you, but I'll need the `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID` (or you can add them yourself in GitHub repo settings → Secrets).
