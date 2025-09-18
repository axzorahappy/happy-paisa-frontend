create table if not exists bookings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  type text not null, -- 'flight' or 'bus'
  item_id uuid not null,
  passenger_name text not null,
  passenger_email text not null,
  passenger_phone text not null,
  created_at timestamptz default now() not null
);