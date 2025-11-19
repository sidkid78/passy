# 🎨 Troubleshooting AI Image Generation

## Image Not Generating? Here's How to Fix It

### ✅ **Requirements Checklist**

Before images can be generated, ensure:

1. **✅ GEMINI_API_KEY is set**
   ```bash
   # In .env.local
   NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here
   ```

2. **✅ Imagen API is enabled**
   - Go to [Google AI Studio](https://aistudio.google.com/)
   - Make sure your API key has access to **Imagen models**
   - Imagen 4.0 is part of Gemini API but may need separate activation

3. **✅ Conversation has started**
   - Image generation triggers after **1+ messages** in the conversation
   - The AI's response must be **300+ characters** long
   - Response should mention theme-related keywords

---

## 🔍 **Debugging Steps**

### Step 1: Check Browser Console

Open DevTools (F12) and look for these logs:

```javascript
[Theme Assistant] Should generate image: true/false
[Theme Assistant] Generating image prompt...
[Theme Assistant] Image prompt created: ...
[Theme Assistant] Calling Imagen API...
[Theme Assistant] ✅ Image generated successfully
```

**If you see `false`:**
- Response is too short (needs 300+ chars)
- No theme keywords detected
- No conversation history yet

**If you see errors:**
- Check the API key
- Check API quota/billing
- Check network tab for failed requests

### Step 2: Verify API Key

```bash
# Test in terminal
echo $NEXT_PUBLIC_GEMINI_API_KEY

# Or check in your app
console.log(process.env.NEXT_PUBLIC_GEMINI_API_KEY)
```

### Step 3: Check Imagen Access

Try this test prompt in your app console:

```javascript
// In browser DevTools Console
fetch('https://generativelanguage.googleapis.com/v1/models?key=YOUR_API_KEY')
  .then(r => r.json())
  .then(data => {
    console.log('Available models:', data.models.filter(m => m.name.includes('imagen')));
  });
```

---

## 🎯 **How to Trigger Image Generation**

The AI will automatically generate an image when:

1. ✅ You're in an active conversation (sent at least 1 message)
2. ✅ The AI gives a detailed response (300+ characters)
3. ✅ The response mentions:
   - "theme"
   - "decor"
   - "color"
   - "centerpiece"
   - "idea"

### Example Prompts That Work:

✅ **Good:**
- "I love Harry Potter and fairy gardens. Can you combine them?"
- "Give me a detailed woodland theme with specific decorations"
- "What would a vintage garden party look like?"

❌ **Won't Trigger:**
- "Hello" (too short)
- "Thanks!" (too short, no theme keywords)
- First message in conversation (needs history)

---

## 🛠 **Manual Workaround**

If automatic generation isn't working, you can request it directly:

**User Message:**
> "Can you describe that theme in detail with colors, decorations, and centerpieces? Also, create a visual image of it."

This ensures:
- Long, detailed response ✅
- Theme keywords included ✅
- Explicit image request ✅

---

## 📊 **Common Issues**

| Issue | Solution |
|-------|----------|
| "Image never appears" | Check console logs, verify API key |
| "Only see text" | Response too short, no keywords detected |
| "API Error 403" | API key doesn't have Imagen access |
| "API Error 429" | Rate limit exceeded, wait a few seconds |
| "API Error 500" | Google AI temporary issue, try again |

---

## 🔧 **Developer Notes**

### Image Generation Logic:

```typescript
// Location: src/ai/flows/theme-assistant-chat.ts

const shouldGenerateImage = 
  hasThemeKeywords &&           // "theme", "decor", "color", etc.
  textResponse.length > 300 &&  // Detailed response
  input.history.length >= 1;    // Not the first message
```

### Imagen API Call:

```typescript
const imageResult = await ai.models.generateImages({
  model: 'imagen-4.0-generate-001',  // Using standard model, not fast
  prompt: `Beautiful baby shower: ${imagePrompt}. Soft lighting, elegant decorations...`,
  config: {
    numberOfImages: 1,
    outputMimeType: 'image/jpeg',  // Explicitly set MIME type
    aspectRatio: '16:9',
  },
});

// Direct base64 conversion (no Buffer needed)
imageUrl = `data:image/jpeg;base64,${firstImage.image.imageBytes}`;
```

**Key Changes from Previous Version:**
- ✅ Using `imagen-4.0-generate-001` (standard) instead of `-fast-generate-001`
- ✅ Added `outputMimeType: 'image/jpeg'` to config
- ✅ Direct base64 conversion without `Buffer.from()` wrapper

---

## 💡 **Testing Locally**

1. Start dev server: `npm run dev`
2. Open browser DevTools (F12) → Console tab
3. Navigate to `/themes`
4. Send a message
5. Watch console for `[Theme Assistant]` logs
6. Check Network tab for `generateImages` API calls

---

## 📞 **Still Having Issues?**

1. **Check API Billing:** Imagen may require a paid Google Cloud account
2. **Verify Region:** Some regions may have delayed Imagen access
3. **Try Different Model:** Change `imagen-4.0-fast-generate-001` to `imagen-3.0-generate-001`

---

**Last Updated:** After adding enhanced logging and keyword detection

