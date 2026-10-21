alter table public.property_reports
add column if not exists status text not null default 'pending';

alter table public.property_reports
add column if not exists reporter_phone text;
