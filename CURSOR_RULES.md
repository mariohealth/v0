# Mario Health - Cursor AI Rules

## 🎯 Project Context

**Mario Health** is a healthcare price transparency platform MVP racing to 2 pilot customers in 8 weeks (started Oct 14, 2025).

**Tech Stack:**
- **Frontend:** Next.js 14, TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** FastAPI (Python), Supabase (PostgreSQL)
- **Auth:** Firebase Authentication
- **Deployment:** Firebase Hosting (frontend), Google Cloud Run (backend)

**Team:**
- **Arman (AZ, CEO):** Frontend lead
- **Arnaud (AC, Backend):** Backend lead

**Timeline:**
- Phase 1 (Weeks 1-3): Foundation → working searchable MVP
- Phase 2 (Weeks 4-6): Traction → 2 pilot customers, payment system
- Phase 3 (Weeks 7-8): Scale prep → automation, investor-ready polish

---

## 🔴 CRITICAL: Always Check Config FIRST (Before Any Code Analysis)

### **When Debugging Deployment or Production Issues:**

**MANDATORY FIRST STEPS** (30 seconds):

```bash
# 1. Check Next.js build configuration
cat frontend/next.config.mjs | grep "output:"
# MUST show: output: 'export',
# If commented out or missing → THIS IS THE BUG, STOP HERE

# 2. Check Firebase configuration
cat firebase.json | grep "public"
# MUST show: "public": "out"

# 3. Verify build output directory
ls -la frontend/out/
# If directory missing → build config issue, not code issue
```

**IF ANY OF THESE FAIL:**
1. ❌ STOP immediately
2. ❌ DO NOT analyze code logic
3. ✅ Report the config issue
4. ✅ Explain the fix
5. ✅ Wait for user confirmation before proceeding

**ONLY AFTER ALL 3 PASS:**
- Then proceed to code analysis
- Then check API endpoints
- Then investigate component logic

---

## 🚨 Red Flags That Mean "Check Config First"

If you see ANY of these in user messages or error logs, **check config immediately**:

- ❌ "No such file or directory: frontend/out"
- ❌ "`next export` has been removed"
- ❌ "Build succeeded but feature broken in production"
- ❌ "Works locally but not in production"
- ❌ "Autocomplete fails in production"
- ❌ Firebase deployment uploads files but site is broken
- ❌ Console logs show old/missing code in production

**These are CONFIG issues, not CODE issues.**

---

## 🏗️ Architecture & Deployment Rules

### **Next.js Build Configuration (CRITICAL)**

```javascript
// frontend/next.config.mjs
const nextConfig = {
  // 🔒 DO NOT REMOVE OR COMMENT OUT
  // Required for Firebase Hosting static deployment
  output: 'export',  
  
  // These features DON'T work with static export:
  // ❌ API routes (use separate backend)
  // ❌ Server components (use client components)
  // ❌ Middleware (handle in Firebase or backend)
};
```

**Why this matters:**
- Without `output: 'export'`, Next.js builds for Node.js runtime (server-side)
- Firebase Hosting can only serve static files
- Missing this line = broken production deployment

### **Deployment Architecture**

```
Frontend (Next.js static)     Backend (Python API)
       ↓                            ↓
   Firebase Hosting          Google Cloud Run
       ↓                            ↓
   Static HTML/JS/CSS         REST API endpoints
```

**Rules:**
- ✅ Frontend: Pure static site, no server-side code
- ✅ Backend: Separate service, all API logic here
- ❌ NO mixing: Don't put API routes in Next.js
- ❌ NO server components: Use 'use client' directives

---

## 📋 Standard Debugging Workflow

### **For "Works Locally, Fails in Production" Issues:**

```
Step 1: Configuration Check (30 seconds)
  ↓
  ├─ Config wrong? → Report fix, STOP
  └─ Config correct?
       ↓
Step 2: Build Verification (1 minute)
  ├─ Run: cd frontend && npm run build
  ├─ Check: ls -la out/
  └─ Verify: out/index.html exists
       ↓
       ├─ Build broken? → Fix build errors
       └─ Build works?
            ↓
Step 3: Local Static Test (2 minutes)
  ├─ Run: npx serve out/
  ├─ Test: Open localhost:3000
  └─ Reproduce: Try the failing feature
       ↓
       ├─ Static build broken? → CODE issue
       └─ Static build works?
            ↓
Step 4: Compare Deployment
  ├─ Check: Deployed files vs local /out
  └─ Report: Findings with specific file differences
```

### **For Feature Implementation:**

```
Step 1: Check Files (use @Codebase)
  ↓
Step 2: Read Current Code
  ↓
Step 3: Verify Bug/Requirement
  ↓
Step 4: Suggest Changes (BEFORE and AFTER)
  ↓
Step 5: Include Testing Steps
```

---

## 🎯 Output Format for Diagnostics

When investigating production issues, structure output as:

```markdown
## 1. Configuration Check ✅/❌
[Results of grep commands + ls checks]

## 2. Build Verification ✅/❌
[Results of npm run build + /out directory check]

## 3. Root Cause
[Only include if steps 1-2 passed]
- What: [Specific issue found]
- Where: [File/line number]
- Why: [Explanation of how it causes the observed behavior]

## 4. Recommended Fix
[Specific, actionable steps with code examples]

## 5. Testing Checklist
[ ] Fix applied locally
[ ] npm run build succeeds
[ ] npx serve out/ works
[ ] Feature works in static build
[ ] Ready to deploy
```

---

## 🚀 Deployment Workflow

### **Available Commands:**

```bash
# Validate config and build (recommended before every deploy)
npm run validate

# Full deployment with validation
npm run deploy

# Alternative: manual validated deployment
npm run deploy:safe

# Emergency: skip validation (use only if you know config is correct)
cd frontend && npm run build && firebase deploy --only hosting
```

### **Pre-Deployment Checklist:**

```bash
# 1. Verify config is correct
grep "output: 'export'" frontend/next.config.mjs

# 2. Run validation
cd frontend && npm run validate

# 3. Test static build locally
npx serve out/
# → Open localhost:3000 and test critical features

# 4. Deploy
npm run deploy

# 5. Verify in production
# → Open https://mario-mrf-data.web.app
# → Test same features as step 3
# → Check browser console for errors
```

---

## 💻 Implementation Best Practices

### **1. Always Check Files Before Suggesting Changes**

```
User: "Fix the provider routing bug"

Cursor should:
1. @Codebase search for "router.push" in search/procedure components
2. Find: router.push('/home') 
3. Confirm this is wrong (should be dynamic provider route)
4. Suggest: router.push(`/providers/${provider.provider_id}`)
5. Show BEFORE and AFTER code side-by-side
```

### **2. Provide Complete, Working Code**

❌ **DON'T:**
```typescript
// Add price display here
<div>{/* TODO: Add price */}</div>
```

✅ **DO:**
```typescript
<div className="text-right">
  <p className="text-xs text-muted-foreground">From</p>
  <p className="font-semibold text-green-600">
    ${result.best_price}
  </p>
</div>
```

### **3. Follow Existing Patterns**

- ✅ Use shadcn/ui components (Button, Card, Input, etc.)
- ✅ Use Tailwind for styling (no custom CSS)
- ✅ Use TypeScript with proper types
- ✅ Follow Next.js 14 App Router conventions
- ✅ Use Supabase client patterns for backend

### **4. Include Error Handling**

```typescript
// ALWAYS include try-catch for API calls
try {
  const result = await apiCall();
  setData(result);
} catch (error) {
  console.error('[Component] Error:', error);
  setError('Failed to load. Please try again.');
} finally {
  setLoading(false);
}
```

### **5. Provide Testing Steps**

After every code suggestion:
```
To test:
1. npm run dev
2. Navigate to [specific page]
3. Perform [specific action]
4. Verify [expected behavior]
5. Check console for errors
```

---

## 📁 Project File Structure Reference

```
mario-health/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── search/page.tsx          # Search results page
│   │   │   ├── procedures/[slug]/       # Procedure detail
│   │   │   ├── providers/[npi]/         # Provider detail
│   │   │   ├── profile/page.tsx         # User profile
│   │   │   ├── home/page.tsx            # Home/landing
│   │   │   └── login/page.tsx           # Login page
│   │   ├── components/
│   │   │   ├── ui/                      # shadcn components
│   │   │   ├── mario-smart-search.tsx   # Main search component
│   │   │   └── [feature]-card.tsx       # Various card components
│   │   └── lib/
│   │       ├── api.ts                   # API client
│   │       ├── firebase.ts              # Firebase auth
│   │       └── utils.ts                 # Utilities
│   ├── scripts/
│   │   ├── validate-build.sh            # Build validation
│   │   └── deploy.sh                    # Safe deployment
│   ├── next.config.mjs                  # Next.js configuration
│   ├── package.json                     # Dependencies + scripts
│   └── out/                             # Build output (generated)
│
├── backend/
│   └── mario-health-api/
│       ├── app/
│       │   ├── api/v1/endpoints/
│       │   │   ├── procedures.py        # Procedure endpoints
│       │   │   ├── doctors.py           # Doctor search
│       │   │   ├── insurance.py         # Insurance endpoints
│       │   │   └── consent.py           # HIPAA consent
│       │   ├── services/
│       │   │   └── pricing_service.py   # MPS calculation
│       │   ├── middleware/
│       │   │   └── audit_log.py         # HIPAA audit logging
│       │   └── main.py
│       └── requirements.txt
│
├── firebase.json                        # Firebase Hosting config
├── CURSOR_RULES.md                      # This file
└── README.md                            # Project documentation
```

---

## 🎨 Common Code Patterns

### **API Calls (Standard Pattern)**

```typescript
const [data, setData] = useState<DataType | null>(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  fetchData();
}, []);

const fetchData = async () => {
  setLoading(true);
  setError(null);
  
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Request failed');
    const data = await response.json();
    setData(data);
  } catch (error) {
    console.error('[Component] Fetch error:', error);
    setError(error.message);
  } finally {
    setLoading(false);
  }
};
```

### **Auth Token (Firebase)**

```typescript
import { auth } from '@/lib/firebase';

const token = await auth.currentUser?.getIdToken();

fetch(url, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

### **Tailwind Responsive Patterns**

```typescript
// Mobile-first responsive grid
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"

// Spacing
className="space-y-4"  // Vertical spacing between children
className="gap-4"      // Grid/flex gap

// Colors (use design system)
className="text-muted-foreground"
className="bg-blue-50"
className="border-blue-300"

// Typography
className="text-sm font-medium"
className="text-lg font-semibold"
```

---

## 🚫 What NOT to Do

### **Configuration & Deployment:**
- ❌ Don't analyze code logic before checking config
- ❌ Don't modify next.config.mjs without explicit approval
- ❌ Don't suggest "just redeploy" without verifying what changed
- ❌ Don't write 40-page forensic reports on irrelevant code paths
- ❌ Don't assume environment matches local development

### **Code Implementation:**
- ❌ Don't use placeholder code with TODOs
- ❌ Don't suggest incomplete solutions
- ❌ Don't skip error handling
- ❌ Don't ignore TypeScript errors
- ❌ Don't use custom CSS (use Tailwind)
- ❌ Don't create API routes in Next.js (use backend)

### **Communication:**
- ❌ Don't ask questions that are already answered in these rules
- ❌ Don't provide vague suggestions without code examples
- ❌ Don't skip testing steps in your responses

---

## ✅ What TO Do

### **Configuration & Deployment:**
- ✅ Check config first, always (30 seconds)
- ✅ Test locally before claiming something is fixed
- ✅ Verify deployment artifacts match expectations
- ✅ Provide concise, actionable diagnostics
- ✅ Use validation scripts before deploying

### **Code Implementation:**
- ✅ Search @Codebase before suggesting changes
- ✅ Show BEFORE and AFTER code
- ✅ Provide complete, working code with error handling
- ✅ Follow existing patterns and conventions
- ✅ Include specific testing steps

### **Communication:**
- ✅ Ask clarifying questions if context is unclear
- ✅ Structure responses with clear sections
- ✅ Provide actionable next steps
- ✅ Reference specific files and line numbers
- ✅ Explain WHY, not just WHAT

---

## 🎯 Business Context & Success Metrics

### **Current Phase Priorities:**

**Technical Metrics:**
- Search response time: <200ms (p95)
- Data accuracy: >95%
- Uptime: 99.9%
- Coverage: 200+ CPT codes by Sprint 5
- Coverage: 5+ carriers by Sprint 5

**Business Metrics:**
- User interviews: 10+ (Sprint 2-3)
- Pilot customers: 2 (Sprint 4-6)
- MRR target: $500+ (Sprint 6)
- Payment system: Live (Sprint 6)
- Investor readiness: Sprint 8

### **Risk Flags to Escalate:**

🚨 **Immediate escalation if:**
- Data accuracy drops below 95%
- API response time exceeds 200ms consistently
- Critical bug blocks pilot customer usage
- Deployment process is broken
- Security vulnerability discovered

⚠️ **Monitor and report:**
- Technical debt accumulating
- Sprint timeline at risk
- Integration conflicts between AZ/AC work
- Missing dependencies for upcoming milestones

---

## 🤝 Team Coordination

### **Decision Authority:**

- **Frontend (UI/UX, components, state):** AZ decides
- **Backend (DB, API design, optimization):** AC decides
- **Integration (API contracts, types, errors):** Joint decision
- **Business priorities:** AZ decides, Cursor advises on tradeoffs

**When unclear:** Provide 2-3 options with pros/cons, recommend one, let team decide.

---

## 📝 Git Commit Message Format

When suggesting commits, use this format:

```
<type>: <subject>

<body>
```

**Types:**
- `feat:` New feature
- `fix:` Bug fix
- `chore:` Maintenance (no functional change)
- `docs:` Documentation
- `refactor:` Code restructure (no behavior change)
- `test:` Adding tests
- `perf:` Performance improvement

**Example:**
```
feat: add automated build validation script

- Validates next.config.mjs has 'output: export' before building
- Checks that /out directory is created with expected files
- Provides clear error messages for common deployment issues
- Prevents deploying broken builds to Firebase
```

---

## 🧪 Testing Checklist (Use After Every Implementation)

```
[ ] Feature works locally (npm run dev)
[ ] No console errors or warnings
[ ] No TypeScript errors (npm run type-check if available)
[ ] Mobile responsive (test at 375px, 768px, 1024px widths)
[ ] Static build works (npm run build && npx serve out/)
[ ] Feature works in static build (test same as local)
[ ] Ready to deploy (npm run validate passes)
[ ] Deployed to Firebase (npm run deploy)
[ ] Works in production (test at https://mario-mrf-data.web.app)
[ ] No production console errors
```

---

## 🎓 Learning from Past Issues

### **Case Study: Autocomplete Production Failure (Dec 25, 2024)**

**What happened:**
- Autocomplete worked locally but failed in production
- Initial diagnosis spent hours analyzing code logic
- Root cause: `output: 'export'` was commented out in next.config.mjs

**Lessons learned:**
1. ✅ Always check build config BEFORE code analysis
2. ✅ Validate deployment artifacts match local build
3. ✅ Use validation scripts to prevent config issues
4. ✅ Don't assume "works locally" means "will work in production"

**Prevention:**
- Automated validation script checks config
- Scary comment in next.config.mjs prevents accidental changes
- Standard deployment process includes validation
- These rules enforce config-first debugging

---

## 📚 Additional Resources

- **Next.js Static Export:** https://nextjs.org/docs/app/building-your-application/deploying/static-exports
- **Firebase Hosting:** https://firebase.google.com/docs/hosting
- **shadcn/ui:** https://ui.shadcn.com
- **Tailwind CSS:** https://tailwindcss.com/docs

---

## 🔄 When to Update These Rules

Update this file when:
- ✅ New deployment process is established
- ✅ Common debugging pattern emerges
- ✅ Architecture changes significantly
- ✅ New team members join (add context)
- ✅ Repeated issues occur (add prevention rules)

**Version:** 2.0 (December 26, 2024)
**Maintained by:** Arman (AZ)
**Auto-loaded by:** Cursor AI on every prompt

