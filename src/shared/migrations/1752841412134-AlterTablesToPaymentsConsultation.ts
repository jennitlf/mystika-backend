import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTablesToPaymentsConsultation1752841412134 implements MigrationInterface {
    name = 'AlterTablesToPaymentsConsultation1752841412134'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."payments_status_enum" AS ENUM('pending', 'in_process', 'approved', 'rejected', 'canceled', 'refunded', 'chargeback', 'authorized', 'outro')`);
        await queryRunner.query(`CREATE TYPE "public"."payments_payment_method_type_enum" AS ENUM('card', 'boleto', 'pix', 'other')`);
        await queryRunner.query(`CREATE TABLE "payments" ("id" SERIAL NOT NULL, "consultation_id" integer, "mercadopago_payment_id" character varying(255) NOT NULL, "mercadopago_status_detail" character varying(255), "mercadopago_json_response" jsonb, "amount_paid" numeric(10,2) NOT NULL, "currency" character varying(3) NOT NULL DEFAULT 'BRL', "status" "public"."payments_status_enum" NOT NULL DEFAULT 'pending', "status_updated_at" TIMESTAMP, "payment_date" TIMESTAMP, "payment_method_type" "public"."payments_payment_method_type_enum" NOT NULL, "card_last_4" character varying(4), "card_brand" character varying(50), "card_exp_month" integer, "card_exp_year" integer, "pix_code" text, "pix_qr_code_url" character varying(500), "boleto_url" character varying(500), "expirationDate" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_2c084fc0feafa8e5e944ce3dedb" UNIQUE ("mercadopago_payment_id"), CONSTRAINT "PK_197ab7af18c93fbb0c9b28b4a59" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "payment_methods_customer" ("id" SERIAL NOT NULL, "customer_id" integer NOT NULL, "mercadopago_payment_method_token" character varying(255) NOT NULL, "last_4" character varying(4) NOT NULL, "brand" character varying(50) NOT NULL, "exp_month" integer NOT NULL, "exp_year" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_ed24383754203e9f1c8d521e491" UNIQUE ("mercadopago_payment_method_token"), CONSTRAINT "PK_d8d4eb6f793843b5ee65cc5dada" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "consultant" DROP COLUMN "payment_plan"`);
        await queryRunner.query(`ALTER TABLE "consultant" DROP COLUMN "appellant"`);
        await queryRunner.query(`ALTER TABLE "customer" ADD "mercadopago_customer_id" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "customer" ADD CONSTRAINT "UQ_03f4acbfc4c4701386c7706f5ea" UNIQUE ("mercadopago_customer_id")`);
        await queryRunner.query(`ALTER TABLE "consultation" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "consultation" ADD "status" character varying(18) DEFAULT 'pendente_pagamento'`);
        await queryRunner.query(`ALTER TABLE "consultant" ALTER COLUMN "status" SET DEFAULT 'pendente'`);
        await queryRunner.query(`ALTER TABLE "consultation" ADD CONSTRAINT "UQ_003e04d7afa5b86feeccd1bc63c" UNIQUE ("id_customer", "id_schedule_consultant", "appoinment_date_time")`);
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "FK_60e9e7a83c417fe2dd0b95d245f" FOREIGN KEY ("consultation_id") REFERENCES "consultation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment_methods_customer" ADD CONSTRAINT "FK_8546594ae63fe2b0adef15deb7c" FOREIGN KEY ("customer_id") REFERENCES "customer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment_methods_customer" DROP CONSTRAINT "FK_8546594ae63fe2b0adef15deb7c"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_60e9e7a83c417fe2dd0b95d245f"`);
        await queryRunner.query(`ALTER TABLE "consultation" DROP CONSTRAINT "UQ_003e04d7afa5b86feeccd1bc63c"`);
        await queryRunner.query(`ALTER TABLE "consultant" ALTER COLUMN "status" SET DEFAULT 'inativo'`);
        await queryRunner.query(`ALTER TABLE "consultation" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "consultation" ADD "status" character varying(15) DEFAULT 'pendente'`);
        await queryRunner.query(`ALTER TABLE "customer" DROP CONSTRAINT "UQ_03f4acbfc4c4701386c7706f5ea"`);
        await queryRunner.query(`ALTER TABLE "customer" DROP COLUMN "mercadopago_customer_id"`);
        await queryRunner.query(`ALTER TABLE "consultant" ADD "appellant" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "consultant" ADD "payment_plan" character varying(25) NOT NULL DEFAULT 'mensal'`);
        await queryRunner.query(`DROP TABLE "payment_methods_customer"`);
        await queryRunner.query(`DROP TABLE "payments"`);
        await queryRunner.query(`DROP TYPE "public"."payments_payment_method_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."payments_status_enum"`);
    }

}
