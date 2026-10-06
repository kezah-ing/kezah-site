# One-time setup: GitHub, Vercel and the editor

You do these steps yourself on your own accounts. Never share a password or card details with anyone, including Claude.

## 1. GitHub (where the site lives)
1. Create an account at github.com with services@kezahkayitesi.com or your Gmail.
2. Click **New repository**. Name it `kezah-site`. Choose **Private**. Do not add a README. Create it.
3. Send Claude the repository name (`your-username/kezah-site`). It will place the site files in it.

## 2. Vercel (publishes the site)
1. Create an account at vercel.com using **Continue with GitHub**.
2. **Add New → Project**, choose `kezah-site`, keep the default settings (it detects Astro), and press **Deploy**.
3. You get a free address ending in `.vercel.app`. That is your live site for now.

## 3. The editor (so you can edit without code)
Keystatic Cloud is the easiest sign-in. 
1. Go to keystatic.cloud and sign in with GitHub. Create a team, then a project linked to the `kezah-site` repository.
2. Copy the project name it shows (it looks like `your-team/kezah-site`).
3. In Vercel, open the project → **Settings → Environment Variables** and add `PUBLIC_KEYSTATIC_CLOUD_PROJECT` with that name. Redeploy once.
4. Visit `your-site.vercel.app/keystatic` and sign in.

## 4. Forms and booking
- **Booking:** already connected to your Cal.com page. In Cal.com, rename the event types to "Initial consult" (15 min, free) and "Exploration call" (60 min).
- **Enquiry form:** create a free form at formspree.io pointing to services@kezahkayitesi.com. Paste its address into Site settings.

## 5. Domain and email (after the site is live)
Buy kezahkayitesi.com yourself at Cloudflare Registrar, Namecheap or Porkbun, then tell Claude. It will give you the exact records to paste into Vercel and your domain's DNS page, and set up services@kezahkayitesi.com forwarding to your Gmail.
