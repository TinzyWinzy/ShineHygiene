create table if not exists staff_members (
  auth_user_id uuid not null unique,
  email text not null unique,
  name text not null,
  role text not null default 'staff',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint staff_members_role_check check (role in ('owner', 'admin', 'ops', 'cleaner'))
);

create table if not exists quotes (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  lead_id uuid not null references leads(id) on delete cascade,
  customer_name text not null,
  customer_phone text not null,
  vertical text not null,
  params jsonb not null,
  quote jsonb not null,
  total_cents integer not null,
  status text not null default 'new',
  currency text not null default 'USD',
  source text not null default 'web',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint quotes_vertical_check check (vertical in ('commercial', 'residential', 'office', 'car', 'hygienemart')),
  constraint quotes_status_check check (status in ('new', 'contacted', 'confirmed', 'declined', 'expired')),
  constraint quotes_total_cents_check CHECK (total_cents >= 0)
);

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid not null references quotes(id) on delete cascade,
  reference text not null unique,
  customer_name text not null,
  customer_phone text not null,
  vertical text not null,
  scheduled_date date not null,
  scheduled_time time not null,
  status text not null default 'pending',
  assigned_staff_auth_user_id uuid,
  notes jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint bookings_vertical_check check (vertical in ('commercial', 'residential', 'office', 'car', 'hygienemart')),
  constraint bookings_status_check check (status in ('pending', 'confirmed', 'completed', 'cancelled', 'no_show')),
  constraint bookings_quote_fk foreign key (quote_id) references quotes(id) on delete cascade,
  constraint bookings_staff_fk foreign key (assigned_staff_auth_user_id) references staff_members(auth_user_id) on update cascade on delete set null
);

create table if not exists audit_events (
  id uuid primary key default gen_random_uuid(),
  actor_id text,
  action text not null,
  entity_type text not null,
  entity_id text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists quotes_lead_id_idx on quotes (lead_id);
create index if not exists quotes_status_created_at_idx on quotes (status, created_at desc);
create index if not exists bookings_quote_id_idx on bookings (quote_id);
create index if not exists bookings_status_scheduled_date_idx on bookings (status, scheduled_date);
create index if not exists audit_events_created_at_idx on audit_events (created_at desc);

insert into quotes (
  reference,
  lead_id,
  customer_name,
  customer_phone,
  vertical,
  params,
  quote,
  total_cents,
  status,
  currency,
  source,
  created_at
)
select
  l.reference,
  l.id,
  l.name,
  l.phone,
  l.vertical,
  l.params,
  l.quote,
  l.total_cents,
  case l.status
    when 'new' then 'new'
    when 'contacted' then 'contacted'
    when 'quoted' then 'new'
    when 'won' then 'confirmed'
    when 'lost' then 'expired'
  end,
  'USD',
  l.source,
  l.created_at
from leads l
where not exists (
  select 1
  from quotes q
  where q.lead_id = l.id
);
