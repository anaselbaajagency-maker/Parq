# Frontend Testing Plan (Next.js)

Status on **2026-02-28**:
- `npm` access to `registry.npmjs.org` is unavailable in this environment (`ENOTFOUND`).
- React Testing Library and Playwright cannot be installed here yet.

## 1) Unit/Component Tests (React Testing Library)

Target stack once npm access is restored:
- `vitest`
- `@testing-library/react`
- `@testing-library/jest-dom`
- `jsdom`

Critical flows to cover first:
1. Auth form validation and submit states:
`/src/app/[locale]/login/page.tsx`
`/src/app/[locale]/register/page.tsx`
2. Wallet actions:
`/src/app/[locale]/tableau-de-bord/wallet/WalletClient.tsx`
3. Listing form behavior:
`/src/components/DynamicListingForm.tsx`
4. Admin listing moderation actions:
`/src/app/[locale]/admin/listings/page.tsx`

## 2) E2E Smoke Tests (Playwright)

Target smoke suite once npm access is restored:
1. Login flow:
- Open localized login page
- Submit valid credentials
- Assert dashboard redirect
2. Create listing flow:
- Authenticate user
- Fill create listing form
- Submit and assert listing appears
3. Admin screens:
- Admin login
- Open admin listings page
- Approve/reject one listing and assert status badge update

## 3) Commands To Run When Registry Access Is Available

```bash
cd frontend
npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom @playwright/test
npx playwright install --with-deps
```

Then wire scripts in `frontend/package.json`:
- `test:unit`
- `test:e2e`
- `test:smoke`
