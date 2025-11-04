# Cursor Commands Configuration

This directory contains reusable Cursor commands for the Mario Health project.

## Available Commands

### `/Test APIs`

Runs automated backend and frontend API health test, validates endpoint reachability, and summarizes results.

**Usage:**
- Type `/Test APIs` in Cursor chat
- Or run: `node .cursor/commands/test-apis.js`

**What it does:**
1. Checks backend reachability
2. Runs `scripts/test-api-endpoints.js`
3. Parses results and displays summary
4. Shows pass rate, warnings, errors
5. Displays latest commit hash

**Output includes:**
- ✅ Pass rate percentage
- ⚠️ Warnings count
- ❌ Errors count
- 🌐 Base URL being used
- 📦 Latest commit hash

**Example output:**
```
🧪 API Validation Test

✅ Backend reachable at http://localhost:8000

📊 Test Results Summary

✅ 15 / 19 endpoints passed (78.9%)
⚠️  4 warnings (expected: auth / validation)
❌ 0 errors

🌐 Base URL: http://localhost:8000
📦 Last Commit: 21b11a3c

🎯 All critical endpoints reachable — frontend↔backend integration healthy
```

