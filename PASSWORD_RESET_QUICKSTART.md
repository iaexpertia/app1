# 🚀 Password Reset - Quick Start Guide

## ✅ Implementation Status: COMPLETE

All code changes are done. You just need to configure Supabase.

---

## 🔧 Required: Configure Supabase (2 minutes)

### Step 1: Open Supabase Dashboard
Go to: https://supabase.com/dashboard

### Step 2: Select Your Project
Project: `fwkeqxleiqrzrczqibhe` (from your .env)

### Step 3: Add Redirect URLs
1. Click **Authentication** in left sidebar
2. Click **URL Configuration**
3. Scroll to **Redirect URLs**
4. Add these URLs (one per line):
   ```
   https://cyclepeaks.com/auth/reset-password
   https://www.cyclepeaks.com/auth/reset-password
   ```
5. Click **Save**

### Step 4: (Optional) Add Development URL
If testing locally, also add:
```
http://localhost:5173/auth/reset-password
```

---

## 🧪 Test the Flow

### Production Test:
1. Go to: `https://cyclepeaks.com/forgot-password`
2. Enter your email
3. Click "Enviar Email"
4. Check your inbox
5. Click the link in the email
6. Set new password
7. Done!

### Local Test:
1. Update `ForgotPassword.tsx` line 23:
   ```typescript
   redirectTo: 'http://localhost:5173/auth/reset-password'
   ```
2. Run: `npm run dev`
3. Go to: `http://localhost:5173/forgot-password`
4. Follow same steps as production

---

## 📋 What's Implemented

### Routes:
✅ `/forgot-password` - Request password reset
✅ `/auth/reset-password` - Set new password (NEW)
✅ `/update-password` - Legacy route (still works)

### Components:
✅ `ForgotPassword.tsx` - Email form
✅ `UpdatePassword.tsx` - Password form with validation

### Features:
✅ Password strength validation
✅ Real-time feedback
✅ Show/hide password
✅ Error handling
✅ Loading states
✅ Success confirmation
✅ Auto-redirect after success

---

## 🔒 Password Requirements

When user resets password, they must use:
- ✅ Minimum 8 characters
- ✅ At least 1 uppercase letter
- ✅ At least 1 number
- ✅ At least 1 special character (@, #, $, etc.)
- ✅ Passwords must match

---

## ⚡ Quick Reference

### Redirect URL (Production):
```
https://cyclepeaks.com/auth/reset-password
```

### Redirect URL (Development):
```
http://localhost:5173/auth/reset-password
```

### Files Changed:
- `src/components/ForgotPassword.tsx` (line 23)
- `src/utils/authService.ts` (line 28)
- `src/App.tsx` (lines 68-69)

---

## 🐛 Troubleshooting

### Email not arriving?
→ Check spam folder
→ Verify email exists in database
→ Wait 1 hour (rate limit)

### "Invalid redirect URL"?
→ Add URL to Supabase Dashboard
→ Must match exactly
→ No trailing slash

### Link expired?
→ Links expire after 1 hour
→ Request new link from `/forgot-password`

### Password won't update?
→ Check password requirements
→ Verify passwords match
→ Check browser console for errors

---

## 📚 Full Documentation

For detailed information, see:
- `PASSWORD_RESET_IMPLEMENTATION.md` - Complete implementation details
- `SUPABASE_PASSWORD_RESET_CONFIG.md` - Supabase configuration guide

---

## ✅ Final Checklist

- [x] Code changes completed
- [x] Build successful
- [ ] **→ Add redirect URLs to Supabase Dashboard** (DO THIS NOW)
- [ ] Test locally (optional)
- [ ] Deploy to production
- [ ] Test in production

---

**That's it!** Just configure Supabase and you're ready to go. 🎉
