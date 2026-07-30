CREATE TABLE "student_profile" (
	"profile_id" serial PRIMARY KEY NOT NULL,
	"address" text NOT NULL,
	"phone" varchar(10),
	"student_id" integer NOT NULL,
	CONSTRAINT "student_profile_student_id_unique" UNIQUE("student_id")
);
--> statement-breakpoint
ALTER TABLE "student_profile" ADD CONSTRAINT "student_profile_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE no action ON UPDATE no action;