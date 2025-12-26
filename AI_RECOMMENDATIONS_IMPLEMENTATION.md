# AI Recommendations Feature Implementation

## Overview
This document describes the AI-powered recommendations feature that generates architectural guidance based on the workshop inputs using Groq's free API with Llama 3.3 70B.

**The AI is specifically tuned for your Django/Vue.js architecture**, providing recommendations that work within your existing tech stack rather than suggesting complete rewrites.

## Target Architecture Context

The AI recommendations are tailored for:
- **Backend**: Django modular monolith
- **API Layer**: Django Rest Framework (DRF)
- **Integration Pattern**: Ports & Adapters (Hexagonal Architecture)
- **Design Philosophy**: Domain-Driven Design (DDD)
- **Event Handling**: Django signals (used judiciously)
- **Frontend**: Vue.js SPAs
- **State Management**: Pinia

This context is automatically included in every prompt to ensure recommendations are practical and immediately actionable within your existing codebase.

## Architecture

### Frontend-Only Implementation
- **No backend required**: The UI calls Groq API directly from the browser
- **User-provided API keys**: Users enter their own free Groq API key
- **Local storage**: API keys are stored in browser localStorage for convenience
- **Security**: API key never leaves the user's browser

## Features Implemented

### 1. API Key Management
- **Dialog prompt**: Users are prompted to enter their Groq API key on first use
- **Local storage**: Key is persisted across sessions using localStorage
- **Security warning**: Users are informed about how their key is stored
- **Easy access**: Link provided to get free Groq API key (https://console.groq.com/keys)
- **Key management**: Users can save, update, or clear their API key

### 2. AI Recommendations Generation
- **Context-aware prompts**: Builds comprehensive prompts including:
  - System areas
  - Strategic goals
  - Selected architecture characteristics
  - Identified risks with probability, impact, and scores
- **Groq integration**: Uses **Llama 3.3 70B Versatile** model via Groq's OpenAI-compatible API
- **Loading states**: Shows "Generating..." while processing
- **Error handling**: Gracefully handles API failures, invalid keys, rate limits

### 3. Recommendations Display
- **Structured output**: AI provides:
  1. Analysis of characteristic-goal alignment
  2. Risk mitigation strategies
  3. Recommended architectural patterns
  4. Technology considerations
  5. Prioritized next steps
- **Copy to clipboard**: One-click copy of recommendations
- **Regenerate**: Users can regenerate recommendations if needed
- **Clean formatting**: White-space preserved for readability

## Technical Implementation

### Dependencies
```json
{
  "dependencies": {
    "openai": "^4.77.0"
  }
}
```

### Key Functions

#### `buildPrompt()`
Constructs a comprehensive prompt from all workshop data:
- System areas list
- Strategic goals list
- Each selected characteristic with:
  - Name and description
  - All risks with probability, impact, and calculated scores

#### `generateRecommendations()`
Main function that:
1. Checks for API key (prompts if missing)
2. Dynamically imports OpenAI SDK
3. Configures Groq client with OpenAI-compatible endpoint
4. Sends structured prompt
5. Displays response or error

#### `initializeApiKey()`
Loads stored API key from localStorage on component mount

#### `saveApiKey()`
Saves API key to localStorage and triggers generation

### State Management
```typescript
const showApiKeyDialog = ref(false)    // Controls dialog visibility
const apiKey = ref('')                  // User's Groq API key
const recommendations = ref('')         // Generated recommendations text
const isGenerating = ref(false)         // Loading state
const generationError = ref('')         // Error messages
```

## UI Components

### 1. Generate Button
- Located in risk assessment section header
- Purple/violet color scheme to distinguish from other actions
- Disabled state while generating
- Shows "Generating..." during API call

### 2. API Key Dialog
- Modal overlay with backdrop
- Input field (type=password) for API key
- Security note about local storage
- Link to Groq console to get free key
- Save & Generate / Cancel actions

### 3. Recommendations Section
- Appears after successful generation
- Purple/violet themed border
- Header with Copy and Regenerate actions
- Error message display (if API call fails)
- Pre-formatted content area preserving AI response structure

## Testing

### Test Coverage (18 new tests)
1. ✅ Generate button visibility
2. ✅ API key prompt on first use
3. ✅ API key input field exists
4. ✅ API key entry and saving
5. ✅ Link to Groq console
6. ✅ Loading state display
7. ✅ Recommendations section display
8. ✅ Dialog close/cancel functionality
9. ✅ Error message display
10. ✅ System areas in prompt context
11. ✅ Strategic goals in prompt context
12. ✅ Characteristics in prompt context
13. ✅ Risk descriptions in prompt context
14. ✅ Copy to clipboard functionality
15. ✅ API key persistence
16. ✅ Regenerate functionality
17. ✅ Readable formatting
18. ✅ Security warning display

## Usage Flow

### User Journey
1. Complete workshop (system areas → goals → characteristics → risks)
2. Click **"Generate AI Recommendations"** button
3. First time: Enter Groq API key in dialog
4. Wait 5-10 seconds while AI generates recommendations
5. Read comprehensive, context-aware architectural guidance
6. Copy recommendations for documentation
7. Optionally regenerate for alternative suggestions

### Getting a Free Groq API Key
1. Visit https://console.groq.com/keys
2. Sign up (free, no credit card required)
3. Create new API key
4. Copy key starting with `gsk_...`
5. Paste into the dialog
6. Key is saved for future use

## Groq Configuration

### Model Used
- **Model**: `llama-3.3-70b-versatile` (Updated from deprecated 3.1)
- **Why**: Latest model, excellent reasoning for architecture, fast, free tier sufficient
- **Temperature**: 0.7 (balanced creativity/consistency)
- **Max tokens**: 2000 (comprehensive responses)

### API Endpoint
```typescript
baseURL: 'https://api.groq.com/openai/v1'
```
Uses OpenAI-compatible API for easy migration to OpenAI if needed.

### Free Tier Limits
- **60 requests per minute**
- **14,400 requests per day**
- More than sufficient for typical workshop usage

## Error Handling

### Scenarios Covered
1. **No API key**: Prompts user to enter key
2. **Invalid API key**: Shows error, clears key, prompts again
3. **Network errors**: Displays error message with retry option
4. **Rate limiting**: Shows error message
5. **API timeout**: Graceful error display
6. **Deprecated model**: Updated to llama-3.3-70b-versatile

## Security Considerations

### Current Implementation
- ✅ API key stored in browser localStorage only
- ✅ Key never sent to any server except Groq
- ✅ User explicitly provides their own key
- ✅ Warning about key storage shown to users
- ✅ HTTPS required for Groq API calls

### User Privacy
- Workshop data (system areas, goals, risks) is sent to Groq API
- No personal data required
- Users control their own API keys
- No data stored on our servers

## Future Enhancements

### Potential Improvements
1. **Streaming responses**: Show recommendations as they're generated
2. **Conversation mode**: Allow follow-up questions about recommendations
3. **Export options**: PDF, Markdown, or Word document export
4. **Template customization**: Let users customize prompt structure
5. **Multiple providers**: Support OpenAI, Claude, or local models
6. **Recommendation history**: Save previous recommendations
7. **Architecture Decision Records**: Auto-generate ADRs from recommendations

### Migration to Backend (Optional)
If needed later:
- Create `/api/recommendations` endpoint
- Store API key server-side as environment variable
- Add rate limiting and usage tracking
- Enable caching of common recommendations
- No frontend code changes needed (same function calls)

## Installation Instructions

### For Development
```bash
cd frontend
npm install
npm run dev
```

### For Production
1. Ensure `openai` package is in package.json dependencies
2. Build normally: `npm run build`
3. No environment variables needed (user-provided keys)

## Troubleshooting

### "Cannot find module 'openai'"
Run: `npm install`

### "Invalid API key"
- Check key starts with `gsk_`
- Get new key from https://console.groq.com/keys
- Clear localStorage and try again

### "Model has been decommissioned" Error
- Fixed: Now uses `llama-3.3-70b-versatile` (the latest model)
- Previous model `llama-3.1-70b-versatile` was deprecated

### "Network error"
- Check internet connection
- Verify Groq API status
- Try again in a few moments

### No recommendations generated
- Check browser console for errors
- Verify API key is correct
- Ensure risks are added to characteristics
- Try regenerating

## Files Modified

1. **Workshop.spec.ts**: Added 18 test cases for AI recommendations
2. **Workshop.vue**: 
   - Added AI state management
   - Implemented Groq API integration
   - Added API key dialog UI
   - Added recommendations display UI
   - Added comprehensive styling
3. **package.json**: Added `openai` dependency
4. **GROQ_SETUP.md**: User guide for getting API keys
5. **AI_RECOMMENDATIONS_IMPLEMENTATION.md**: This file

## Example Prompt Structure

```
Analyze this software architecture workshop output and provide recommendations specific to our technology stack and architectural patterns.

CURRENT PLATFORM ARCHITECTURE:
- Backend: Django modular monolith
- API Layer: Django Rest Framework (DRF)
- Integration Pattern: Ports & Adapters (Hexagonal Architecture) for third-party integrations
- Design Approach: Domain-Driven Design (DDD) principles encouraged
- Event Handling: Django signals used occasionally for decoupling
- Frontend: Vue.js Single Page Applications (SPAs)
- State Management: Pinia for Vue.js state management

SYSTEM AREAS:
- Payment Processing
- User Authentication

STRATEGIC GOALS:
- Improve system scalability by 10x
- Reduce operational costs

SELECTED ARCHITECTURE CHARACTERISTICS WITH RISKS:

Scalability:
  Description: A function of system capacity and growth over time...
  Identified Risks:
  - Database becomes bottleneck (Probability: 3, Impact: 3, Risk Score: 9)
  - Cache invalidation issues (Probability: 2, Impact: 2, Risk Score: 4)

[... more characteristics ...]

Please provide recommendations that:
1. Analyze how these characteristics align with the stated goals
2. Suggest specific risk mitigation strategies for each identified risk
3. Recommend architectural patterns or approaches that work within our Django modular monolith
4. Consider how to leverage DRF, Ports & Adapters, DDD, and Django signals appropriately
5. Address frontend considerations for Vue.js SPAs with Pinia state management where relevant
6. Provide Django-specific implementation guidance (models, views, serializers, services, etc.)
7. Suggest when and how to use Django signals vs other patterns
8. Recommend Pinia store patterns and Vue.js architecture best practices
9. Recommend testing strategies appropriate for Django/DRF/Vue/Pinia stack
10. Provide prioritized, actionable next steps

Keep recommendations practical, specific to Django/DRF/Vue/Pinia, and avoid suggesting major architectural changes unless absolutely necessary for the characteristics. Prefer evolutionary improvements within the existing modular monolith structure.
```

## Example AI Response

The AI now provides Django/Vue-specific responses like:

### **Alignment Analysis**
- How scalability supports 10x growth within Django modular monolith
- Considerations for module boundaries and cohesion

### **Risk Mitigations (Django-Specific)**
- **Database bottleneck**: 
  - Implement Django query optimization (select_related, prefetch_related)
  - Add database read replicas using Django's DB router
  - Use Django caching framework with Redis
  - Consider Django's database connection pooling
  
- **Cache invalidation**:
  - Django signals for cache invalidation on model changes
  - Cache versioning strategies in DRF serializers
  - Use Django's cache_page decorator strategically

### **Architectural Patterns**
- **Service Layer**: Create Django service classes separate from views
- **Ports & Adapters**: Use for payment gateway integrations
  ```python
  # Port (interface)
  class PaymentGatewayPort(ABC):
      @abstractmethod
      def process_payment(self, amount: Decimal) -> PaymentResult
  
  # Adapter (implementation)
  class StripeAdapter(PaymentGatewayPort):
      def process_payment(self, amount: Decimal) -> PaymentResult:
          # Stripe-specific implementation
  ```
  
- **DDD Patterns**: Aggregate roots, value objects, domain events
- **Django Signals**: When to use vs service layer orchestration

### **DRF Recommendations**
- ViewSets organization
- Serializer optimization
- Permission classes
- Throttling for rate limiting
- API versioning strategies

### **Vue.js & Pinia Frontend**
- Pinia store organization patterns (feature-based vs domain-based)
- State composition and reusability
- API client integration with Pinia actions
- Caching strategies in Pinia stores
- Real-time updates with Django Channels and Pinia reactivity
- Optimistic updates and error handling

### **Pinia-Specific Patterns**
```typescript
// Feature-based store
export const usePaymentStore = defineStore('payment', () => {
  const payments = ref<Payment[]>([])
  const isLoading = ref(false)
  
  // Actions call Django DRF APIs
  async function fetchPayments() {
    isLoading.value = true
    const response = await api.get('/api/payments/')
    payments.value = response.data
    isLoading.value = false
  }
  
  return { payments, isLoading, fetchPayments }
})
```

### **Testing Strategies**
- Django unit tests for domain logic
- DRF API tests
- Vue component tests with Vitest
- Pinia store unit tests
- Integration tests
- Load testing with Locust

### **Next Steps** (Prioritized)
1. Week 1: Add database indexes on hot paths
2. Week 2: Implement read replicas for reporting queries
3. Month 1: Extract payment processing to Ports & Adapters
4. Quarter 1: Implement CQRS for high-traffic modules

---

**Status**: ✅ Enhanced with Django/DRF/Vue context
**Model**: Llama 3.3 70B Versatile (Latest)
**Last Updated**: December 12, 2024
