create table if not exists public.support_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 100),
  email text not null check (char_length(email) between 3 and 254),
  message text not null check (char_length(message) between 1 and 3000),
  created_at timestamptz not null default now()
);

alter table public.support_messages enable row level security;

revoke all on public.support_messages from anon, authenticated;
grant insert on public.support_messages to anon, authenticated;

create policy "Allow visitors to submit support messages"
on public.support_messages
for insert
to anon, authenticated
with check (
  char_length(trim(name)) between 1 and 100
  and char_length(trim(email)) between 3 and 254
  and char_length(trim(message)) between 1 and 3000
);
