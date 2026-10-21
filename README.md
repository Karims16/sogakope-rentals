# Sogakope Rentals

A local-first rental marketplace for Sogakope and South Tongu, built with Next.js App Router, TypeScript, and Tailwind CSS.

## Project status

### Implemented preview features

- Responsive homepage, mobile navigation, accessible search controls, and illustrative listing cards.
- Browser-side location, property type, rent, and bedroom filters for clearly labeled demo content.
- Property detail route with demo fallback, photo viewer, contact routing for real listings, and reporting form.
- Email/password landlord and agent accounts, sign-in, account metadata for contact details, and an authenticated property-submission gate.
- Landlord dashboard for viewing, editing, availability updates, and deleting owned listings.
- Property submission writes new records as pending in Supabase and uploads selected photos to the `property-images` Storage bucket.
- Admin dashboard reads listings and reports and updates listing status/availability through the Supabase client, subject to RLS. Its client-side access-key screen is not a substitute for server-verified administrator authorization.
- About, Contact, Terms, and Privacy pages; sitemap, robots rules, and application error/404 pages.
- The demo homes, photos/illustrations, prices, reports, and availability are not real listings.
- Contact form delivery and deployment are not fully configured.

### Remaining implementation stages

1. Configure Supabase Row Level Security policies so listing owners can manage only their own records and administrator actions require a server-verified administrator role.
2. Persist report review status and rejection notes if required by the moderation workflow.
3. Add automated tests, finalize privacy and service terms with legal review, and complete deployment configuration.

## Requirements

- Node.js 20.9 or newer (required by Next.js 15)
- npm
- A Supabase project for backend features (not required for the current homepage)

## Run locally

In PowerShell, from this folder:

```powershell
npm install
npm run dev
```

Open http://localhost:3000.

Before using Supabase features, copy `.env.example` to `.env.local` and fill in the Supabase project URL and publishable/anonymous key from the Supabase dashboard. Set `NEXT_PUBLIC_SITE_URL` to the canonical HTTPS domain when deploying so generated sitemap and Open Graph metadata use the production domain. Never put a service-role key in browser code or commit real credentials.

Apply the SQL files in `supabase/migrations` to the Supabase project before using the related features. The landlord portal requires `20261021111500_add_property_owner.sql` to add the `properties.user_id` owner reference. Configure and verify Supabase Auth email settings and Row Level Security policies before launch; the client-side UI gate alone does not secure database writes.

The submission form's multi-select water supply feature requires applying `20261021123500_add_multiple_water_sources.sql`, which adds `properties.water_sources` and backfills values from the existing `water_source` field. The private contact form requires applying `20261021130000_create_support_messages.sql` and setting the server-only `RESEND_API_KEY` and `SUPPORT_RECIPIENT_EMAIL` values in `.env.local` and the deployment environment. Verify the sender domain with Resend before replacing the example `onboarding@resend.dev` sender.

The About, Contact, Terms, and Privacy pages describe current data handling. Contact inquiries are stored in Supabase and emailed to the configured private support inbox; the support-message table permits insert-only access to visitors and does not allow them to read submitted messages. The policy pages need operational/legal review before launch.

## Checks

```powershell
npm run lint
npm run typecheck
npm run build
```
