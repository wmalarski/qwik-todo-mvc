CREATE TABLE IF NOT EXISTS "passwords" (
	"hash" varchar NOT NULL,
	"user_id" uuid NOT NULL
);

CREATE TABLE IF NOT EXISTS "todos" (
	"complete" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"user_id" uuid NOT NULL
);

CREATE TABLE IF NOT EXISTS "users" (
	"created_at" timestamp DEFAULT now() NOT NULL,
	"email" text NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

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
