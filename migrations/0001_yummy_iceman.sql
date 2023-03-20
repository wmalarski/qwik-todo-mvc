CREATE TABLE IF NOT EXISTS "passwords" (
	"hash" varchar NOT NULL,
	"user_id" varchar NOT NULL
);

CREATE TABLE IF NOT EXISTS "todos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"complete" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"user_id" varchar NOT NULL
);

CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

DROP TABLE User;
DROP TABLE Password;
DROP TABLE Todo;
DROP TABLE pg_stat_statements;
DO $$ BEGIN
 ALTER TABLE passwords ADD CONSTRAINT passwords_user_id_users_id_fk FOREIGN KEY ("user_id") REFERENCES users("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE todos ADD CONSTRAINT todos_user_id_users_id_fk FOREIGN KEY ("user_id") REFERENCES users("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
