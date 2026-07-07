-- Maker gallery uploads and editorial review queue

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'maker-gallery',
  'maker-gallery',
  false,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create table if not exists public.maker_gallery_images (
  id uuid primary key default gen_random_uuid(),
  maker_slug text not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  image_url text not null,
  caption text not null default '',
  alt_text text not null default '',
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  uploaded_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_maker_gallery_images_slug_status
  on public.maker_gallery_images (maker_slug, status, uploaded_at desc);

create index if not exists idx_maker_gallery_images_user_status
  on public.maker_gallery_images (user_id, status, uploaded_at desc);

create or replace trigger trg_maker_gallery_images_set_updated_at
before update on public.maker_gallery_images
for each row execute function public.set_updated_at();

alter table public.maker_gallery_images enable row level security;

drop policy if exists maker_gallery_images_service_role_all on public.maker_gallery_images;
create policy maker_gallery_images_service_role_all
on public.maker_gallery_images
for all
to service_role
using (true)
with check (true);

drop policy if exists maker_gallery_images_user_select_own on public.maker_gallery_images;
create policy maker_gallery_images_user_select_own
on public.maker_gallery_images
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists maker_gallery_images_user_insert_linked_owner on public.maker_gallery_images;
create policy maker_gallery_images_user_insert_linked_owner
on public.maker_gallery_images
for insert
to authenticated
with check (
  auth.uid() = user_id
  and status = 'pending'
  and exists (
    select 1
    from public.business_claims claim
    join public.business_listing_owners owner
      on owner.business_listing_id = claim.business_listing_id
    where claim.business_slug = maker_gallery_images.maker_slug
      and claim.status = 'approved'
      and owner.user_id = auth.uid()
      and owner.status = 'active'
  )
);

drop policy if exists maker_gallery_storage_service_role_access on storage.objects;
create policy maker_gallery_storage_service_role_access
on storage.objects
for all
to service_role
using (bucket_id = 'maker-gallery')
with check (bucket_id = 'maker-gallery');
