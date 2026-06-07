-- Run this once in Supabase Dashboard -> SQL Editor.
-- It adds the client and pet record fields used by the booking form.

alter table public.bookings
add column if not exists home_address text,
add column if not exists city_state_zip text,
add column if not exists owner_home_phone text,
add column if not exists owner_work_phone text,
add column if not exists guardian_home_phone text,
add column if not exists guardian_cell_phone text,
add column if not exists guardian_work_phone text,
add column if not exists pet_type text,
add column if not exists pet_type_other text,
add column if not exists pet_weight text,
add column if not exists pet_sex text,
add column if not exists pet_date_of_birth date,
add column if not exists pet_color text,
add column if not exists spayed_neutered text;
