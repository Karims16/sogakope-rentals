do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'property_reports'
      and column_name = 'reporter_phone'
  ) and exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'property_reports'
      and column_name = 'contact_phone'
  ) then
    update public.property_reports
      set contact_phone = coalesce(contact_phone, reporter_phone);
    alter table public.property_reports
      drop column reporter_phone;
  elsif exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'property_reports'
      and column_name = 'reporter_phone'
  ) and not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'property_reports'
      and column_name = 'contact_phone'
  ) then
    alter table public.property_reports
      rename column reporter_phone to contact_phone;
  elsif not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'property_reports'
      and column_name = 'contact_phone'
  ) then
    alter table public.property_reports
      add column contact_phone text;
  end if;
end
$$;
