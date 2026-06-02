create table if not exists public.admins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  email text,
  created_at timestamp default now(),
  unique (user_id)
);

alter table public.bookings
add column if not exists cancellation_token text unique;

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
