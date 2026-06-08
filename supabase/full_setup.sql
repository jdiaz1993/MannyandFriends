-- Run this in Supabase Dashboard -> SQL Editor
-- https://supabase.com/dashboard/project/_/sql

-- ---------------------------------------------------------------------------
-- Bookings table (skip if you already created it)
-- ---------------------------------------------------------------------------
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  owner_name text not null,
  phone text not null,
  email text not null,
  home_address text,
  city_state_zip text,
  owner_home_phone text,
  owner_work_phone text,
  dog_name text not null,
  dog_breed text,
  pet_type text,
  pet_type_other text,
  pet_weight text,
  pet_sex text,
  pet_date_of_birth date,
  pet_color text,
  spayed_neutered text,
  service_type text not null,
  add_ons text[] default '{}',
  appointment_date date not null,
  appointment_time text not null,
  notes text,
  cancellation_token text unique,
  status text not null default 'confirmed',
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

alter table public.bookings enable row level security;

-- ---------------------------------------------------------------------------
-- Admins table
-- ---------------------------------------------------------------------------
create table if not exists public.admins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  email text,
  created_at timestamp with time zone default now(),
  unique (user_id)
);

alter table public.admins enable row level security;

-- ---------------------------------------------------------------------------
-- Contact messages table
-- ---------------------------------------------------------------------------
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  status text not null default 'unread',
  created_at timestamp with time zone default now()
);

alter table public.contact_messages enable row level security;

-- ---------------------------------------------------------------------------
-- Public booking policies (customer site)
-- ---------------------------------------------------------------------------
drop policy if exists "Public can insert bookings" on public.bookings;
create policy "Public can insert bookings"
on public.bookings
for insert
to anon, authenticated
with check (true);

drop policy if exists "Public can read bookings for availability" on public.bookings;

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

drop policy if exists "Public can submit contact messages" on public.contact_messages;
create policy "Public can submit contact messages"
on public.contact_messages
for insert
to anon, authenticated
with check (true);

-- ---------------------------------------------------------------------------
-- Admin policies
-- ---------------------------------------------------------------------------
drop policy if exists "Admins can read their own admin row" on public.admins;
create policy "Admins can read their own admin row"
on public.admins
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "Admins can view bookings" on public.bookings;
create policy "Admins can view bookings"
on public.bookings
for select
to authenticated
using (
  exists (
    select 1
    from public.admins
    where admins.user_id = auth.uid()
  )
);

drop policy if exists "Admins can update bookings" on public.bookings;
create policy "Admins can update bookings"
on public.bookings
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

drop policy if exists "Admins can delete bookings" on public.bookings;
create policy "Admins can delete bookings"
on public.bookings
for delete
to authenticated
using (
  exists (
    select 1
    from public.admins
    where admins.user_id = auth.uid()
  )
);

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

-- ---------------------------------------------------------------------------
-- After running this SQL:
-- 1. Create an admin user in Authentication -> Users
-- 2. Copy that user's UUID and run:
--
-- insert into public.admins (user_id, email)
-- values ('YOUR_AUTH_USER_UUID', 'your-email@example.com');
--
-- 3. Deploy these Edge Functions:
--    supabase functions deploy send-booking-confirmation
--    supabase functions deploy cancel-booking
--
-- 4. Set Edge Function secrets:
--    supabase secrets set RESEND_API_KEY=your_resend_api_key
--    supabase secrets set BOOKING_FROM_EMAIL="Doodles & Friends by Manny <bookings@yourdomain.com>"
-- ---------------------------------------------------------------------------
