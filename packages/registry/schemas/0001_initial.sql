create table if not exists wristkit_samples (
  id           bigserial primary key,
  user_id      uuid,
  metric       text not null,
  value        numeric not null,
  unit         text not null,
  recorded_at  timestamptz not null,
  source       text,
  ingested_at  timestamptz not null default now()
);

create index if not exists idx_metric_recorded
  on wristkit_samples (metric, recorded_at desc);

create index if not exists idx_user_metric_recorded
  on wristkit_samples (user_id, metric, recorded_at desc);

