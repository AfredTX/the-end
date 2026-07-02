# =====================================================================
#  publish-photos.ps1
#
#  Run this each time new photos have been committed to main (e.g. Abby
#  uploaded them through the GitHub website). It:
#     1. pulls the newly-committed photos down to this folder,
#     2. builds fast web copies (thumbnails + view images) for them,
#     3. commits those copies and the updated photo list,
#     4. pushes so the live site updates.
#
#  HOW TO RUN (from this folder, in PowerShell):
#     .\publish-photos.ps1
#
#  If Windows blocks it the first time, run this once, then retry:
#     Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
# =====================================================================

$ErrorActionPreference = "Stop"
Set-Location -Path $PSScriptRoot   # always run from the repo folder

function Fail($msg) { Write-Host "`n[X] $msg" -ForegroundColor Red; exit 1 }

# --- 1. Get the latest photos committed to main --------------------------
Write-Host "==> Pulling latest from GitHub..." -ForegroundColor Cyan
git fetch origin
if ($LASTEXITCODE -ne 0) { Fail "Could not reach GitHub (git fetch failed)." }

git merge --ff-only origin/main
if ($LASTEXITCODE -ne 0) {
    Fail "Pull could not fast-forward. You have local commits or edits that " +
         "conflict. Resolve them (or run 'git pull') and try again."
}

# --- 2. Build web-sized copies + regenerate the photo list ---------------
Write-Host "==> Building thumbnails and view copies..." -ForegroundColor Cyan
py build-photos.py
if ($LASTEXITCODE -ne 0) {
    Fail "build-photos.py failed. If it mentions Pillow, run: py -m pip install pillow"
}

# --- 3. Stage the generated copies + list (and any new originals) --------
git add photos photos-data.js
if ($LASTEXITCODE -ne 0) { Fail "git add failed." }

# Nothing changed? Then everything was already published.
git diff --cached --quiet
if ($LASTEXITCODE -eq 0) {
    Write-Host "`n[OK] Nothing new to publish - the site is already up to date." -ForegroundColor Green
    exit 0
}

# --- 4. Commit and push --------------------------------------------------
Write-Host "==> Committing and pushing..." -ForegroundColor Cyan
git commit -m "Publish web copies for newly uploaded photos"
if ($LASTEXITCODE -ne 0) { Fail "git commit failed." }

git push origin main
if ($LASTEXITCODE -ne 0) { Fail "git push failed (check your GitHub sign-in)." }

Write-Host "`n[OK] Done. The live site updates within about a minute." -ForegroundColor Green
