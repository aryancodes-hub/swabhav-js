ALTER TABLE "student_profile" DROP CONSTRAINT "student_profile_student_id_students_id_fk";
--> statement-breakpoint
ALTER TABLE "student_profile" ADD CONSTRAINT "student_profile_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE cascade ON UPDATE no action;