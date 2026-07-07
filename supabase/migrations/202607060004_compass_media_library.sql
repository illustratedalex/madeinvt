-- Compass Media Library (DAM) foundation

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'compass-media',
  'compass-media',
  false,
  104857600,
  array[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/heic',
    'video/mp4',
    'video/quicktime',
    'application/pdf'
  ]
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  alt_text text not null default '',
  asset_type text not null default 'image' check (asset_type in ('image', 'video', 'document')),
  url text not null,
  thumbnail_url text not null default '',
  tags text[] not null default '{}',
  attached_to text[] not null default '{}',
  credit text,
  license text,
  notes text,
  file_size bigint,
  width integer,
  height integer,
  usage_count integer not null default 0,
  status text not null default 'draft' check (status in ('draft', 'approved', 'archived')),
  publication text not null default 'Future',
  folder text not null default 'Gallery',
  section text not null default 'All Media',
  caption text not null default '',
  photographer text not null default '',
  captured_at date not null default current_date,
  gps text not null default '',
  related_entity_type text not null default 'Maker',
  related_entity text not null default '',
  issue text not null default '',
  keywords text[] not null default '{}',
  ai_description text not null default '',
  file_name text not null default '',
  mime_type text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table if exists public.media_assets
  add column if not exists publication text not null default 'Future',
  add column if not exists folder text not null default 'Gallery',
  add column if not exists section text not null default 'All Media',
  add column if not exists caption text not null default '',
  add column if not exists photographer text not null default '',
  add column if not exists captured_at date not null default current_date,
  add column if not exists gps text not null default '',
  add column if not exists related_entity_type text not null default 'Maker',
  add column if not exists related_entity text not null default '',
  add column if not exists issue text not null default '',
  add column if not exists keywords text[] not null default '{}',
  add column if not exists ai_description text not null default '',
  add column if not exists file_name text not null default '',
  add column if not exists mime_type text not null default '';

create table if not exists public.media_relationships (
  id uuid primary key default gen_random_uuid(),
  asset_id uuid not null references public.media_assets(id) on delete cascade,
  relation_type text not null check (relation_type in ('Attach to Story', 'Attach to Maker', 'Attach to Place', 'Use as Hero', 'Use in Collection', 'Export')),
  target_type text not null,
  target_value text not null,
  publication text not null default 'Future',
  created_at timestamptz not null default now()
);

alter table if exists public.media_relationships
  add column if not exists relation_type text,
  add column if not exists target_type text,
  add column if not exists target_value text,
  add column if not exists publication text not null default 'Future',
  add column if not exists created_at timestamptz not null default now();

update public.media_relationships
set
  relation_type = coalesce(relation_type, 'Attach to Story'),
  target_type = coalesce(target_type, 'entity'),
  target_value = coalesce(target_value, 'unknown')
where relation_type is null or target_type is null or target_value is null;

alter table public.media_relationships
  alter column relation_type set not null,
  alter column target_type set not null,
  alter column target_value set not null;

create index if not exists idx_media_assets_publication_section_status
  on public.media_assets (publication, section, status, created_at desc);

create index if not exists idx_media_assets_issue
  on public.media_assets (issue);

create index if not exists idx_media_assets_photographer
  on public.media_assets (photographer);

create index if not exists idx_media_assets_captured_at
  on public.media_assets (captured_at);

create index if not exists idx_media_assets_related_entity
  on public.media_assets (related_entity_type, related_entity);

create index if not exists idx_media_relationships_asset
  on public.media_relationships (asset_id, created_at desc);

create or replace trigger trg_media_assets_set_updated_at
before update on public.media_assets
for each row execute function public.set_updated_at();

alter table public.media_assets enable row level security;
alter table public.media_relationships enable row level security;

drop policy if exists media_assets_service_role_all on public.media_assets;
create policy media_assets_service_role_all
on public.media_assets
for all
to service_role
using (true)
with check (true);

drop policy if exists media_relationships_service_role_all on public.media_relationships;
create policy media_relationships_service_role_all
on public.media_relationships
for all
to service_role
using (true)
with check (true);

drop policy if exists compass_media_storage_service_role_all on storage.objects;
create policy compass_media_storage_service_role_all
on storage.objects
for all
to service_role
using (bucket_id = 'compass-media')
with check (bucket_id = 'compass-media');
