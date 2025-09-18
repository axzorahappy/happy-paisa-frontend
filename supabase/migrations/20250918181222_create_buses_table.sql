create table if not exists buses (
  id uuid default gen_random_uuid() primary key,
  from_city text not null,
  to_city text not null,
  date date not null,
  price numeric not null,
  bus_operator text not null,
  created_at timestamptz default now() not null
);