alter table public.properties
add column if not exists water_sources text[] not null default '{}';

update public.properties
set water_sources = array(
  select trim(source)
  from unnest(string_to_array(coalesce(water_source, ''), ',')) as water_source_value(source)
  where trim(source) <> ''
)
where cardinality(water_sources) = 0
  and coalesce(water_source, '') <> '';
