import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1744037962545 implements MigrationInterface {
  name = 'InitialMigration1744037962545';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "consultant" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "cpf" character varying NOT NULL, "phone" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "profile_data" character varying NOT NULL, "consultants_story" character varying NOT NULL, "about_specialties" character varying NOT NULL, "image_consultant" character varying NOT NULL, "consultations_carried_out" character varying, "status" character varying NOT NULL, "payment_plan" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_0e86adbe5ab2b58254a76ccf698" UNIQUE ("email"), CONSTRAINT "PK_fc6968da0e8b2cb9315222e4bc9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "schedule_exception" ("id" SERIAL NOT NULL, "id_schedule_consultant" integer NOT NULL, "date_exception" TIMESTAMP NOT NULL, "day_week" integer NOT NULL, "unavaiable_time" character varying NOT NULL, "reason" character varying NOT NULL, CONSTRAINT "PK_1f0d20ad447327f9709214086b8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "customer" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "phone" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "status" character varying NOT NULL, CONSTRAINT "PK_a7a13f4cacb744524e44dfdad32" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "consultation" ("id" SERIAL NOT NULL, "id_customer" integer NOT NULL, "id_consultant_specialty" integer NOT NULL, "id_schedule_consultant" integer NOT NULL, "appoinment_time" TIME NOT NULL, "appoinment_data" date NOT NULL, "status" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_5203569fac28a4a626c42abe70b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "schedule_consultant" ("id" SERIAL NOT NULL, "id_consultant_specialty" integer NOT NULL, "date" date NOT NULL, "day_week" integer NOT NULL, "hour_initial" TIME NOT NULL, "hour_end" TIME NOT NULL, "status" character varying NOT NULL, CONSTRAINT "PK_532dd03a0ec9d5cfc59ba300d5f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "consultant_specialty" ("id" SERIAL NOT NULL, "id_consultant" integer NOT NULL, "id_specialty" integer NOT NULL, "duration" integer NOT NULL, "value_per_duration" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_431534f149b55e45ed8182a1819" UNIQUE ("id_consultant", "id_specialty"), CONSTRAINT "PK_42bf6bdab69438bd824bc4b7f61" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "specialty" ("id" SERIAL NOT NULL, "name_specialty" character varying NOT NULL, CONSTRAINT "UQ_77e445de6ec0d644084742311d9" UNIQUE ("name_specialty"), CONSTRAINT "PK_9cf4ae334dc4a1ab1e08956460e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "schedule_exception" ADD CONSTRAINT "FK_2fee125666054b0c9543d03f91c" FOREIGN KEY ("id_schedule_consultant") REFERENCES "schedule_consultant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "consultation" ADD CONSTRAINT "FK_2deb16fe0157da166d85f098755" FOREIGN KEY ("id_customer") REFERENCES "customer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "consultation" ADD CONSTRAINT "FK_f4018d1e2b5da78a190df93fdbf" FOREIGN KEY ("id_consultant_specialty") REFERENCES "consultant_specialty"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "consultation" ADD CONSTRAINT "FK_5b3da1fb269f3a2685b18dbdd21" FOREIGN KEY ("id_schedule_consultant") REFERENCES "schedule_consultant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "schedule_consultant" ADD CONSTRAINT "FK_809488658d62e3fd4b4a1b468ec" FOREIGN KEY ("id_consultant_specialty") REFERENCES "consultant_specialty"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "consultant_specialty" ADD CONSTRAINT "FK_ee4399ff36aa457051d1b3f7125" FOREIGN KEY ("id_consultant") REFERENCES "consultant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "consultant_specialty" ADD CONSTRAINT "FK_4bf16704239c1ecea85ff55a3b4" FOREIGN KEY ("id_specialty") REFERENCES "specialty"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "consultant_specialty" DROP CONSTRAINT "FK_4bf16704239c1ecea85ff55a3b4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "consultant_specialty" DROP CONSTRAINT "FK_ee4399ff36aa457051d1b3f7125"`,
    );
    await queryRunner.query(
      `ALTER TABLE "schedule_consultant" DROP CONSTRAINT "FK_809488658d62e3fd4b4a1b468ec"`,
    );
    await queryRunner.query(
      `ALTER TABLE "consultation" DROP CONSTRAINT "FK_5b3da1fb269f3a2685b18dbdd21"`,
    );
    await queryRunner.query(
      `ALTER TABLE "consultation" DROP CONSTRAINT "FK_f4018d1e2b5da78a190df93fdbf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "consultation" DROP CONSTRAINT "FK_2deb16fe0157da166d85f098755"`,
    );
    await queryRunner.query(
      `ALTER TABLE "schedule_exception" DROP CONSTRAINT "FK_2fee125666054b0c9543d03f91c"`,
    );
    await queryRunner.query(`DROP TABLE "specialty"`);
    await queryRunner.query(`DROP TABLE "consultant_specialty"`);
    await queryRunner.query(`DROP TABLE "schedule_consultant"`);
    await queryRunner.query(`DROP TABLE "consultation"`);
    await queryRunner.query(`DROP TABLE "customer"`);
    await queryRunner.query(`DROP TABLE "schedule_exception"`);
    await queryRunner.query(`DROP TABLE "consultant"`);
  }
}
