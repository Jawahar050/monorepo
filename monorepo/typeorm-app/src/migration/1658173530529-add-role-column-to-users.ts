import {
    MigrationInterface,
    QueryRunner,
    TableCheck,
    TableColumn,
  } from "typeorm";
  

export class addRoleColumnToUsers1658173530529 implements MigrationInterface {

    /*
    public async up(queryRunner: QueryRunner): Promise<void> {
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }*/

    public async up(queryRunner: QueryRunner): Promise<any> {
        const usersTable = await queryRunner.getTable("users");
        const roleColumn = new TableColumn({ name: "role", type: "int" });
        await queryRunner.addColumn(usersTable, roleColumn);
      }
    
      public async down(queryRunner: QueryRunner): Promise<any> {
        const usersTable = await queryRunner.getTable("users");
        await queryRunner.dropColumn(usersTable, "role");
      }
}
