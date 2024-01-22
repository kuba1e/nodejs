import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration011704654727595 implements MigrationInterface {
    name = 'Migration011704654727595'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."message_status_enum" AS ENUM('0', '1')`);
        await queryRunner.query(`CREATE TABLE "message" ("id" SERIAL NOT NULL, "text" text NOT NULL, "creatorId" character varying NOT NULL, "chatId" integer NOT NULL, "status" "public"."message_status_enum" NOT NULL DEFAULT '1', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "modifiedAt" TIMESTAMP NOT NULL DEFAULT now(), "readBy" text NOT NULL, "referenceTo" character varying, "forwardedBy" character varying, CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_to_chat_userrole_enum" AS ENUM('1', '2')`);
        await queryRunner.query(`CREATE TABLE "user_to_chat" ("useToChatId" SERIAL NOT NULL, "userId" integer NOT NULL, "chatId" integer NOT NULL, "userRole" "public"."user_to_chat_userrole_enum" NOT NULL DEFAULT '2', CONSTRAINT "PK_b98d172c19b9d17e7346c52a939" PRIMARY KEY ("useToChatId"))`);
        await queryRunner.query(`CREATE TYPE "public"."chat_status_enum" AS ENUM('0', '1')`);
        await queryRunner.query(`CREATE TABLE "chat" ("id" SERIAL NOT NULL, "title" text NOT NULL, "creatorId" character varying NOT NULL, "status" "public"."chat_status_enum" NOT NULL DEFAULT '1', "type" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "modifiedAt" TIMESTAMP NOT NULL DEFAULT now(), "icon" character varying, CONSTRAINT "PK_9d0b2ba74336710fd31154738a5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "token" ("id" SERIAL NOT NULL, "refreshToken" character varying NOT NULL, "accessToken" character varying NOT NULL, "userId" integer NOT NULL, CONSTRAINT "REL_94f168faad896c0786646fa3d4" UNIQUE ("userId"), CONSTRAINT "PK_82fae97f905930df5d62a702fc9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying(150) NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "password" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "nickname" character varying(150) NOT NULL, "phoneNumber" character varying NOT NULL, "avatar" character varying, "settingsId" integer, "tokenId" integer, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_e2364281027b926b879fa2fa1e0" UNIQUE ("nickname"), CONSTRAINT "REL_390395c3d8592e3e8d8422ce85" UNIQUE ("settingsId"), CONSTRAINT "REL_63301650f99948e1ff5e0af00b" UNIQUE ("tokenId"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "settings" ("id" SERIAL NOT NULL, "chatSetting" json NOT NULL, CONSTRAINT "PK_0669fe20e252eb692bf4d344975" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_chats_chat" ("userId" integer NOT NULL, "chatId" integer NOT NULL, CONSTRAINT "PK_73a8d5df1ca4814192e41235296" PRIMARY KEY ("userId", "chatId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_cd5ddfeacb967a4e33d639ee49" ON "user_chats_chat" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_e190c52d44e72db13647dfb745" ON "user_chats_chat" ("chatId") `);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_619bc7b78eba833d2044153bacc" FOREIGN KEY ("chatId") REFERENCES "chat"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_to_chat" ADD CONSTRAINT "FK_f321bfb45d74fb0bd05f3ef2a69" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_to_chat" ADD CONSTRAINT "FK_9bc649a84fe3f8feaebf4b9ad5e" FOREIGN KEY ("chatId") REFERENCES "chat"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "token" ADD CONSTRAINT "FK_94f168faad896c0786646fa3d4a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_390395c3d8592e3e8d8422ce853" FOREIGN KEY ("settingsId") REFERENCES "settings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_63301650f99948e1ff5e0af00b5" FOREIGN KEY ("tokenId") REFERENCES "token"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_chats_chat" ADD CONSTRAINT "FK_cd5ddfeacb967a4e33d639ee499" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_chats_chat" ADD CONSTRAINT "FK_e190c52d44e72db13647dfb745b" FOREIGN KEY ("chatId") REFERENCES "chat"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`CREATE TABLE "query-result-cache" ("id" SERIAL NOT NULL, "identifier" character varying, "time" bigint NOT NULL, "duration" integer NOT NULL, "query" text NOT NULL, "result" text NOT NULL, CONSTRAINT "PK_6a98f758d8bfd010e7e10ffd3d3" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "query-result-cache"`);
        await queryRunner.query(`ALTER TABLE "user_chats_chat" DROP CONSTRAINT "FK_e190c52d44e72db13647dfb745b"`);
        await queryRunner.query(`ALTER TABLE "user_chats_chat" DROP CONSTRAINT "FK_cd5ddfeacb967a4e33d639ee499"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_63301650f99948e1ff5e0af00b5"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_390395c3d8592e3e8d8422ce853"`);
        await queryRunner.query(`ALTER TABLE "token" DROP CONSTRAINT "FK_94f168faad896c0786646fa3d4a"`);
        await queryRunner.query(`ALTER TABLE "user_to_chat" DROP CONSTRAINT "FK_9bc649a84fe3f8feaebf4b9ad5e"`);
        await queryRunner.query(`ALTER TABLE "user_to_chat" DROP CONSTRAINT "FK_f321bfb45d74fb0bd05f3ef2a69"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_619bc7b78eba833d2044153bacc"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e190c52d44e72db13647dfb745"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cd5ddfeacb967a4e33d639ee49"`);
        await queryRunner.query(`DROP TABLE "user_chats_chat"`);
        await queryRunner.query(`DROP TABLE "settings"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "token"`);
        await queryRunner.query(`DROP TABLE "chat"`);
        await queryRunner.query(`DROP TYPE "public"."chat_status_enum"`);
        await queryRunner.query(`DROP TABLE "user_to_chat"`);
        await queryRunner.query(`DROP TYPE "public"."user_to_chat_userrole_enum"`);
        await queryRunner.query(`DROP TABLE "message"`);
        await queryRunner.query(`DROP TYPE "public"."message_status_enum"`);
    }

}
