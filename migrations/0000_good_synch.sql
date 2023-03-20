-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migraitons
/*
CREATE TABLE IF NOT EXISTS "User" (
	"id" text NOT NULL,
	"email" text NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL
);

CREATE TABLE IF NOT EXISTS "Password" (
	"hash" text NOT NULL,
	"userId" text NOT NULL
);

CREATE TABLE IF NOT EXISTS "Todo" (
	"id" text NOT NULL,
	"title" text NOT NULL,
	"complete" boolean NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"userId" text NOT NULL
);

CREATE TABLE IF NOT EXISTS "pg_stat_statements" (
	"userid" oid,
	"dbid" oid,
	"queryid" bigint,
	"query" text,
	"plans" bigint,
	"total_plan_time" double precision,
	"min_plan_time" double precision,
	"max_plan_time" double precision,
	"mean_plan_time" double precision,
	"stddev_plan_time" double precision,
	"calls" bigint,
	"total_exec_time" double precision,
	"min_exec_time" double precision,
	"max_exec_time" double precision,
	"mean_exec_time" double precision,
	"stddev_exec_time" double precision,
	"rows" bigint,
	"shared_blks_hit" bigint,
	"shared_blks_read" bigint,
	"shared_blks_dirtied" bigint,
	"shared_blks_written" bigint,
	"local_blks_hit" bigint,
	"local_blks_read" bigint,
	"local_blks_dirtied" bigint,
	"local_blks_written" bigint,
	"temp_blks_read" bigint,
	"temp_blks_written" bigint,
	"blk_read_time" double precision,
	"blk_write_time" double precision,
	"wal_records" bigint,
	"wal_fpi" bigint,
	"wal_bytes" numeric
);

DO $$ BEGIN
 ALTER TABLE Password ADD CONSTRAINT Password_userId_fkey FOREIGN KEY ("userId") REFERENCES User("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE Todo ADD CONSTRAINT Todo_userId_fkey FOREIGN KEY ("userId") REFERENCES User("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS User_email_key ON User ("email");
CREATE UNIQUE INDEX IF NOT EXISTS Password_userId_key ON Password ("userId");
*/