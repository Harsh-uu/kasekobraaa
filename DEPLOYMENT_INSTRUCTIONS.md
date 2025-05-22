# Commit and Deploy Commands

Use the following commands to commit your changes and deploy to production:

## 1. Add all changes to git
```powershell
git add .
```

## 2. Commit with the detailed message
```powershell
git commit -m "Fix authentication and image handling issues" -m "See COMMIT_MESSAGE.md for details"
```

## 3. Push to your repository
```powershell
git push
```

## 4. Deploy to production
```powershell
# For Windows
.\deploy.cmd

# For Unix/Linux/MacOS (if you're using WSL or similar)
# bash ./deploy.sh
```

## 5. Verify in Production
After deployment, verify all the items in the PRODUCTION_TESTING_GUIDE.md document.

## Important Changed Files
- **Authentication:** 
  - src/components/Providers.tsx
  - src/middleware.ts
  - src/app/api/auth/_middleware.ts
  - src/app/auth-callback/page.tsx

- **Image Handling:**
  - src/app/configure/design/DesignConfigurator.tsx
  - src/lib/image-utils.ts

- **Diagnostics:**
  - src/app/diagnostics/page.tsx
  - src/app/api/diagnostics/route.ts
  - src/lib/logger.ts
