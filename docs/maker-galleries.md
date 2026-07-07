# MadeInVT Maker Galleries

Maker galleries allow approved maker owners to upload profile photos for editorial review before public display.

## Overview

- Uploads are submitted from Maker Portal (`/partner-portal`).
- Files are stored in Supabase Storage bucket `maker-gallery`.
- Metadata is stored in `public.maker_gallery_images`.
- Public maker pages only render images with `status = approved`.
- Basecamp review queue is available at `/basecamp/maker-gallery`.

## Table schema

`public.maker_gallery_images`

- `id` (uuid, primary key)
- `maker_slug` (text)
- `user_id` (uuid, auth user)
- `image_url` (text, storage object path)
- `caption` (text)
- `alt_text` (text)
- `status` (`pending | approved | rejected`)
- `uploaded_at` (timestamptz)
- `reviewed_at` (timestamptz, nullable)
- `reviewed_by` (text, nullable)

## Safety + validation

- Uploads require authenticated maker owner access.
- Ownership is checked against approved claims + active owner links.
- Allowed formats: `image/jpeg`, `image/png`, `image/webp`.
- Max file size: `5MB`.
- Files are stored in a private bucket; UI uses signed URLs.
- Pending/rejected images are never shown on public maker pages.

## Manual Supabase storage steps

1. Run migrations (includes `202607060003_maker_gallery_images.sql`).
2. Confirm bucket exists:
   - Bucket ID: `maker-gallery`
   - Public: `false`
   - File size limit: `5242880` bytes
   - MIME types: `image/jpeg`, `image/png`, `image/webp`
3. Verify storage policy `maker_gallery_storage_service_role_access` exists.
4. Verify table `maker_gallery_images` and indexes are present.
5. Submit an upload from Maker Portal and confirm it appears in `/basecamp/maker-gallery` as `pending`.
