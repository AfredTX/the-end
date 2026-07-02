# Setup guide

Four parts: (1) Web3Forms, (2) GitHub Pages, (3) QR code,
(4) editing photo captions.

---

## 1. Web3Forms — get the access key (orders land in your inbox)

Web3Forms emails every order to whatever address you sign up with. Free,
no account password, no server.

1. Go to **https://web3forms.com**.
2. In the **"Create Access Key"** box on the homepage, type the email address
   where orders should arrive (e.g. Abby's email), and click
   **"Create Access Key"**.
3. Check that inbox for an email from Web3Forms. Click the **verify/confirm**
   link inside it. (Orders won't send until the address is verified.)
4. The same email (and the website) shows your **Access Key** — a string that
   looks like `a1b2c3d4-1234-5678-9abc-def012345678`. Copy it.
5. Open **`app.js`** in this project. Near the top, find this line:

   ```js
   const WEB3FORMS_ACCESS_KEY = "YOUR-WEB3FORMS-ACCESS-KEY"; // <-- replace
   ```

   Replace the placeholder with your key (keep the quotes):

   ```js
   const WEB3FORMS_ACCESS_KEY = "a1b2c3d4-1234-5678-9abc-def012345678";
   ```

6. Save the file. Done — that's the only place the recipient is set.

**Test it:** open the site, click a photo, pick a size, fill in name/email,
and submit. You should see "Request sent…" and an email should arrive in the
inbox from step 2. (Web3Forms free tier allows 250 submissions/month.)

> Note: the access key is visible in the page source. That's expected and safe
> for Web3Forms — it only allows sending to your verified inbox, nothing else.

---

## 2. GitHub Pages — publish the site (GitHub CLI)

You'll get a public URL like `https://USERNAME.github.io/REPO/`.

### A. One-time setup
1. Install the GitHub CLI from **https://cli.github.com** (on Windows you can
   also run `winget install --id GitHub.cli`).
2. Sign in — this opens a browser to authorize (create a free GitHub account
   first if you don't have one):

   ```
   gh auth login
   ```

   Choose **GitHub.com** → **HTTPS** → **Login with a web browser**, and follow
   the prompts. Run `gh auth status` to confirm you're logged in.

### B. Create the repo and push the files
From inside this project folder (`theEndPurchasingSite`), run:

```
git init
git add .
git commit -m "Initial site"
gh repo create the-end --public --source=. --remote=origin --push
```

What these do: turn this folder into a git repo, stage every file, make the
first commit, then create a **public** repo named `the-end` on your account and
push everything to it. `index.html` stays at the top level automatically.

> Already have a `the-end` repo? Pick another name, or add `--push` to an
> existing one with `git remote add origin URL && git push -u origin main`.

### C. Turn on Pages
Enable Pages to serve from the `main` branch root, then read back the URL.
In **PowerShell** (write the request body to a file so the brackets/quotes
survive), run:

```powershell
'{"source":{"branch":"main","path":"/"}}' | Set-Content -Encoding ascii "$env:TEMP\pages.json"
gh api -X POST "repos/{owner}/the-end/pages" --input "$env:TEMP\pages.json"
gh api "repos/{owner}/the-end/pages" --jq .html_url
```

(`{owner}` is filled in automatically by `gh`.) Wait ~1 minute, then open the
URL it prints — typically **`https://USERNAME.github.io/the-end/`**.

**To update later**, from this folder:

```
git add .
git commit -m "Update"
git push
```

Pages redeploys automatically within a minute.

---

## 3. QR code → the live page

Once you have the GitHub Pages URL:

```
py -m pip install segno        # one time
py make-qr.py https://USERNAME.github.io/the-end/
```

This writes **`qr.png`** — print it / put it on a card. Scanning it opens the
site. (Test the QR with your phone camera before printing a batch.)

> Prefer no command line? Paste the URL into any QR generator
> (e.g. qr-code-generator.com) and download the PNG.

---

## 4. Editing photo captions (right on GitHub — no computer setup)

The **caption** is the little title shown under a photo and on the order
screen. New photos start as "Untitled no. 1, 2, 3…"; here's how to give one a
real name. You do this entirely in the web browser.

1. Go to the repo: **https://github.com/AfredTX/the-end**
2. Click the file **`photos-data.js`** in the file list.
3. Click the **pencil icon** (✏️ "Edit this file") near the top-right of the
   file.
4. Each photo is **one line** that starts with `{ thumb:` . The lines are in the
   same top-to-bottom order as the gallery. To be sure you have the right one,
   look at the `orig:` part of the line — it shows the photo's filename, e.g.
   `orig: "photos/000041550010.jpg"`.
5. Change **only the words inside the quotes after `caption:`**. For example,
   turn this:

   ```js
   { thumb: "…", view: "…", orig: "photos/000041550010.jpg", caption: "Untitled no. 1", w: 1600, h: 1061 },
   ```

   into this:

   ```js
   { thumb: "…", view: "…", orig: "photos/000041550010.jpg", caption: "Low tide, Wellfleet", w: 1600, h: 1061 },
   ```

   Keep the quotes `"` and the comma. Don't change `thumb`, `view`, `orig`,
   `w`, or `h`.
6. **Don't type a double-quote `"` inside the caption** — it breaks the line.
   Apostrophes (`'`) are fine (e.g. `Abby's porch`).
7. Scroll to the bottom, click the green **"Commit changes…"** button, leave
   **"Commit directly to the `main` branch"** selected, and confirm.
8. Wait ~1 minute, then refresh the site — the new caption is live.

> Your custom captions stick around. When new photos are added later, only the
> leftover "Untitled no. N" placeholders get renumbered — any caption you
> actually typed is kept.
