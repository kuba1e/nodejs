import { AppDataSource } from "../data-source";
import { User } from "../entity";
import { excludeColumns } from "../utils/entity";

export const UserRepository = AppDataSource.getRepository(User).extend({
  getUserByEmail(email: string) {
    return this.findOne({
      where: {
        email,
      },
      relations: {
        settings: true,
      },
    });
  },
  getExtendedUserByEmail(email: string) {
    return this.createQueryBuilder("user")
      .where("user.email = :email", { email })
      .addSelect("user.password")
      .getOne();
  },
});
