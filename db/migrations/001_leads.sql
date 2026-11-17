create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  client_request_id text not null unique,
  reference text not null unique,
  vertical text not null,
  name text not null,
  phone text not null,
  preferred_date date,
  preferred_time time,
  params jsonb not null,
  quote jsonb not null,
  total_cents integer not null,
  status text not null default 'new',
  source text not null default 'web',
  created_at timestamptz not null default now(),
  constraint leads_vertical_check check (vertical in ('commercial', 'residential', 'office', 'car', 'hygienemart')),
  constraint leads_status_check check (status in ('new', 'contacted', 'quoted', 'won', 'lost')),
  constraint leads_name_length check (char_length(name) between 1 and 80),
  constraint leads_phone_length check (char_length(phone) between 5 and 20),
  constraint leads_total_cents_check check (total_cents >= 0)
);

create index if not exists leads_created_at_idx on leads (created_at desc);
create index if not exists leads_status_created_at_idx on leads (status, created_at desc);
