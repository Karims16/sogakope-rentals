create table if not exists public.subscribers (
  email text primary key
    check (
      char_length(email) between 3 and 254
      and email = lower(trim(email))
      and email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
    ),
  created_at timestamptz not null default now()
);

alter table public.subscribers enable row level security;

revoke all on public.subscribers from anon, authenticated;
grant insert on public.subscribers to anon, authenticated;

create policy "Allow visitors to subscribe for listing updates"
on public.subscribers
for insert
to anon, authenticated
with check (
  char_length(email) between 3 and 254
  and email = lower(trim(email))
  and email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
);

alter table public.properties
add column if not exists subscriber_notification_sent_at timestamptz;
