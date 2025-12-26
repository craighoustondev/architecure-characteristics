# Getting Your Free Groq API Key

The AI Recommendations feature uses Groq's free API to generate architectural guidance. Here's how to get your free API key:

## Step-by-Step Guide

### 1. Visit Groq Console
Go to: **https://console.groq.com/keys**

### 2. Sign Up (Free)
- Click "Sign Up" or "Sign In with Google/GitHub"
- No credit card required
- Completely free tier available

### 3. Create API Key
1. Once logged in, click **"Create API Key"**
2. Give it a name (e.g., "Architecture Workshop")
3. Click **"Submit"**

### 4. Copy Your Key
- Your key will start with `gsk_`
- Copy it immediately (you won't see it again!)
- Example: `gsk_abc123xyz456...`

### 5. Use in Workshop
1. Complete your architecture workshop (system areas, goals, characteristics, risks)
2. Click **"Generate AI Recommendations"**
3. Paste your API key when prompted
4. Click **"Save & Generate"**

## Your API Key is Secure

✅ Stored only in your browser (localStorage)  
✅ Never sent to our servers  
✅ Only used to call Groq API directly  
✅ You can clear it anytime  

## Free Tier Limits

Groq's free tier is very generous:
- **60 requests per minute**
- **14,400 requests per day**
- More than enough for workshop usage!

## Model Used

The app uses **Llama 3.3 70B Versatile** - the latest and most capable model from Meta/Groq.

## Troubleshooting

### "Invalid API Key" Error
- Make sure you copied the entire key
- Key should start with `gsk_`
- Generate a new key if needed

### "Rate Limit" Error
- Wait a few seconds and try again
- Free tier: 60 requests/minute

### Want to Clear Your Key?
Open browser console and run:
```javascript
localStorage.removeItem('groq_api_key')
```

## Alternative: Use Your Own OpenAI Key

The code can be easily modified to use OpenAI instead:
1. Get an OpenAI API key from https://platform.openai.com
2. Modify the `baseURL` in `Workshop.vue` to use OpenAI
3. Note: OpenAI requires payment after free trial

## Questions?

- Groq Documentation: https://console.groq.com/docs
- Groq Models: https://console.groq.com/docs/models
- Current Model: `llama-3.3-70b-versatile`

---

Enjoy AI-powered architectural recommendations! 🚀
