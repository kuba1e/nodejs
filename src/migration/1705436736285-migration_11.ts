import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration111705436736285 implements MigrationInterface {
    name = 'Migration111705436736285'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "communications" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "webSocketId" character varying, CONSTRAINT "REL_17a47ba0fc1d0336aaaf824f50" UNIQUE ("userId"), CONSTRAINT "PK_29ec793018d5d5ca19d40149e87" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "communications" ADD CONSTRAINT "FK_17a47ba0fc1d0336aaaf824f50f" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "communications" DROP CONSTRAINT "FK_17a47ba0fc1d0336aaaf824f50f"`);
        await queryRunner.query(`DROP TABLE "communications"`);
    }

}
