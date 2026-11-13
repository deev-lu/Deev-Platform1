#!/usr/bin/env bash
# Runs the Business Hub migration and its RLS tests on a throwaway database.
# Needs a local Postgres 15+ reachable with psql (PGHOST/PGPORT/PGUSER as usual).
set -euo pipefail
cd "$(dirname "$0")/.."
DB=${HUB_TEST_DB:-hub_test}
psql -v ON_ERROR_STOP=1 -q -c "drop database if exists $DB" -c "create database $DB"
psql -v ON_ERROR_STOP=1 -q -d "$DB" -f supabase/tests/supabase_stub.sql
psql -v ON_ERROR_STOP=1 -q -d "$DB" -f supabase/migrations/20261113000000_business_hub.sql
psql -v ON_ERROR_STOP=1 -q -At -d "$DB" -f supabase/tests/rls.test.sql 2>&1 | grep -E "ok |FAIL|PASSED|ERROR" | sed "s/^.*NOTICE:  //"
