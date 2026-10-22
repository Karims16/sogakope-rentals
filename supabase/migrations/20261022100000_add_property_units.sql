alter table public.properties
add column if not exists total_units integer not null default 1,
add column if not exists available_units integer not null default 1;

update public.properties
set available_units = 0
where is_available = false;

alter table public.properties
add constraint properties_unit_counts_check
check (
  total_units >= 1
  and available_units >= 0
  and available_units <= total_units
);
