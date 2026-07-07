-- 0002_dedupe.sql
-- Prevent the Shortcut from inserting duplicate samples when it retries.
-- Safe to run on a table that already has duplicates: the index creation
-- will fail and the user must dedupe first. Run the cleanup CTE below if
-- needed before re-running this migration.

-- Optional one-shot cleanup (uncomment if the unique index fails):
-- with ranked as (
--   select id,
--          row_number() over (
--            partition by user_id, metric, recorded_at
--            order by ingested_at desc
--          ) as rn
--   from wristkit_samples
-- )
-- delete from wristkit_samples
-- where id in (select id from ranked where rn > 1);

create unique index if not exists uq_sample_dedupe
  on wristkit_samples (user_id, metric, recorded_at)
  nulls not distinct;
