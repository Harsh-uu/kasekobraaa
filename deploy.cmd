@echo off
REM Production deployment script for KaseCobra (Windows version)

echo Starting KaseCobra production deployment...

REM Step 1: Make sure we have the latest code
echo Step 1: Pulling latest code from repository...
git pull

REM Step 2: Install dependencies
echo Step 2: Installing dependencies...
call pnpm install

REM Step 3: Build the application
echo Step 3: Building application...
call pnpm run build

REM Check if build was successful
if %ERRORLEVEL% NEQ 0 (
  echo Build failed! Check the errors above and fix them before deploying.
  exit /b 1
)

REM Step 4: Run tests if available
findstr /C:"test" package.json >nul
if %ERRORLEVEL% EQU 0 (
  echo Step 4: Running tests...
  call pnpm test
  
  if %ERRORLEVEL% NEQ 0 (
    echo Tests failed! Please fix the issues before deploying.
    exit /b 1
  )
)

REM Step 5: Deploy to production
echo Step 5: Deploying to production...
REM Add your deployment command here, examples:
REM call vercel --prod
REM call npm run deploy
REM aws s3 sync .next s3://your-bucket-name

echo Deployment successful!
echo Post-deployment checklist:
echo 1. Verify authentication flow in production
echo 2. Test image upload and processing
echo 3. Check all pages load correctly
echo 4. Verify no console errors in browser
echo 5. Visit /diagnostics page to verify system status

echo Done!
