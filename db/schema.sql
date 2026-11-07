create table if not exists sellers (
  id serial primary key,
  company jsonb not null default '{}',   -- {name, website, products[], customerSegments[], existingCustomers[], region[], priceRange, keywords[]}
  icp jsonb not null default '{}',       -- {industry[], companySize, region[], eventTypes[]}
  target jsonb not null default '{}',    -- {companyTypes[], regions[], buyerRoles[]}
  status jsonb not null default '{"company":"draft","icp":"draft","target":"draft"}',
  sources jsonb not null default '{}',   -- {"company.products": <chat_messages.id>}
  updated_at timestamptz not null default now()
);
create table if not exists companies (
  id serial primary key,
  name text not null,
  name_key text not null unique,
  state text not null
);
create table if not exists signals (
  id serial primary key,
  company_id int not null references companies(id),
  source text not null,
  source_record_id text not null,
  signal_date date not null,
  summary text not null,
  region text,
  source_url text not null,
  raw jsonb not null,
  unique (source, source_record_id)
);
create index if not exists signals_company_date on signals(company_id, signal_date desc);
create index if not exists signals_date on signals(signal_date desc);
create table if not exists chat_messages (
  id serial primary key,
  seller_id int not null references sellers(id),
  tab text not null,
  role text not null check (role in ('user','assistant')),
  content text not null,
  created_at timestamptz not null default now()
);
create index if not exists chat_messages_thread on chat_messages(seller_id, tab, id);
