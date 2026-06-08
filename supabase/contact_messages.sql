-- Run this once in Supabase Dashboard -> SQL Editor.
-- It creates the table used by the Contact page and Admin inquiries panel.

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  status text not null default 'unread',
  created_at timestamp with time zone default now()
);

alter table public.contact_messages enable row level security;

drop policy if exists "Public can submit contact messages" on public.contact_messages;
create policy "Public can submit contact messages"
on public.contact_messages
for insert
to anon, authenticated
with check (true);

drop policy if exists "Admins can view contact messages" on public.contact_messages;
create policy "Admins can view contact messages"
on public.contact_messages
for select
to authenticated
using (
  exists (
    select 1
    from public.admins
    where admins.user_id = auth.uid()
  )
);

drop policy if exists "Admins can update contact messages" on public.contact_messages;
create policy "Admins can update contact messages"
on public.contact_messages
for update
to authenticated
using (
  exists (
    select 1
    from public.admins
    where admins.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.admins
    where admins.user_id = auth.uid()
  )
);

drop policy if exists "Admins can delete contact messages" on public.contact_messages;
create policy "Admins can delete contact messages"
on public.contact_messages
for delete
to authenticated
using (
  exists (
    select 1
    from public.admins
    where admins.user_id = auth.uid()
  )
);
