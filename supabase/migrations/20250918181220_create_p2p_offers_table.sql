create table if not exists p2p_offers (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  type text not null,
  amount numeric not null,
  price numeric not null,
  status text default 'open' not null,
  created_at timestamptz default now() not null
);