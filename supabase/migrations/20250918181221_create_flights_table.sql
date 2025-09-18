create table if not exists flights (
  id uuid default gen_random_uuid() primary key,
  from_city text not null,
  to_city text not null,
  departure_date date not null,
  return_date date,
  price numeric not null,
  airline text not null,
  created_at timestamptz default now() not null
);