# samuelanes.com

Personal site for internship recruiting. Next.js + Tailwind, meant to deploy on Vercel.

## Local

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy

1. Push `main` to GitHub.
2. Import the repo in [Vercel](https://vercel.com) (Next.js preset, no env vars).
3. Add `samuelanes.com` and `www.samuelanes.com` in Vercel → Domains.
4. At the registrar, add the `A` / `CNAME` records Vercel shows. Leave the `sabacc` subdomain alone.

`/resume.pdf` is the public resume. Site images live in `/assets`. Large source PDFs and original uploads stay out of git via `.gitignore`.
