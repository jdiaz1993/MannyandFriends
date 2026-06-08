create table if not exists public.admins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  email text,
  created_at timestamp default now(),
  unique (user_id)
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  status text not null default 'unread',
  created_at timestamp with time zone default now()
);

alter table public.bookings
add column if not exists cancellation_token text unique;

alter table public.bookings
add column if not exists home_address text,
add column if not exists city_state_zip text,
add column if not exists owner_home_phone text,
add column if not exists owner_work_phone text,
add column if not exists pet_type text,
add column if not exists pet_type_other text,
add column if not exists pet_weight text,
add column if not exists pet_sex text,
add column if not exists pet_date_of_birth date,
add column if not exists pet_color text,
add column if not exists spayed_neutered text,
add column if not exists add_ons text[] default '{}';

create or replace function public.get_booked_slots(p_appointment_date date)
returns table (appointment_time text)
language sql
security definer
set search_path = public
as $$
  select bookings.appointment_time
  from public.bookings
  where bookings.appointment_date = p_appointment_date
    and bookings.status is distinct from 'cancelled';
$$;

grant execute on function public.get_booked_slots(date) to anon, authenticated;

drop policy if exists "Public can read bookings for availability" on public.bookings;

alter table public.admins enable row level security;

alter table public.contact_messages enable row level security;

create policy "Admins can read their own admin row"
on public.admins
for select
to authenticated
using (user_id = auth.uid());

create policy "Admins can view bookings"
on public.bookings
for select
to authenticated
using (
  exists (
    select 1 from public.admins
    where admins.user_id = auth.uid()
  )
);

create policy "Admins can update bookings"
on public.bookings
for update
to authenticated
using (
  exists (
    select 1 from public.admins
    where admins.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.admins
    where admins.user_id = auth.uid()
  )
);

create policy "Admins can delete bookings"
on public.bookings
for delete
to authenticated
using (
  exists (
    select 1 from public.admins
    where admins.user_id = auth.uid()
  )
);

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
    select 1 from public.admins
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
    select 1 from public.admins
    where admins.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.admins
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
    select 1 from public.admins
    where admins.user_id = auth.uid()
  )
);
