alter table public.properties
add column if not exists water_source text,
add column if not exists meter_type text,
add column if not exists bathroom_type text,
add column if not exists kitchen_type text;
