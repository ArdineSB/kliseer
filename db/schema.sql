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
alter table companies add column if not exists keyword_stars int;
alter table companies add column if not exists freshness_stars int;
alter table companies add column if not exists place_stars int;
alter table companies add column if not exists target_fit_stars int;
alter table companies add column if not exists score int;
alter table companies add column if not exists tier text;
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

-- Auth and guest (grill 7 Nov). Existing seller rows stay: no guest_token_hash, so purge cannot delete them.
create table if not exists users (
  id serial primary key,
  email text not null unique,
  password_hash text not null,
  created_at timestamptz not null default now()
);
create table if not exists sessions (
  id serial primary key,
  user_id int not null references users(id) on delete cascade,
  token_hash text not null unique,
  expires_at timestamptz not null
);
create index if not exists sessions_user on sessions(user_id);
alter table sellers add column if not exists user_id int unique references users(id) on delete cascade;
alter table sellers add column if not exists guest_token_hash text unique;
alter table sellers add column if not exists created_at timestamptz not null default now();
create table if not exists contacts (
  id serial primary key,
  company_id int not null references companies(id) on delete cascade,
  name text not null,
  title text,
  email text,
  phone text,
  linkedin_url text,
  website text,
  social_url text,
  source_url text not null
);
-- Manual contacts belong to the seller who added them; null = shared seed row (C6).
alter table contacts add column if not exists seller_id int references sellers(id) on delete cascade;
create index if not exists contacts_company on contacts(company_id);
-- AI interpretation paragraph per (seller, prospect). Scores stay rule-based (G8).
create table if not exists analyses (
  seller_id int not null references sellers(id) on delete cascade,
  company_id int not null references companies(id) on delete cascade,
  body text not null,
  updated_at timestamptz not null default now(),
  primary key (seller_id, company_id)
);
create table if not exists email_drafts (
  id serial primary key,
  seller_id int not null references sellers(id) on delete cascade,
  company_id int not null references companies(id) on delete cascade,
  subject text not null default '',
  body text not null default '',
  updated_at timestamptz not null default now(),
  unique (seller_id, company_id)
);
