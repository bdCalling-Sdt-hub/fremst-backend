import colors from 'colors';
import { User } from '../app/modules/user/user.model';
import config from '../config';
import { USER_ROLES } from '../enums/user';
import { logger } from '../shared/logger';
import { IUser } from '../app/modules/user/user.interface';

const superUser: any = {
  name: 'Super Admin',
  role: USER_ROLES.SUPERADMIN,
  email: config.admin.email,
  password: config.admin.password,
  verified: true,
};

const seedSuperAdmin = async () => {
  const isExistSuperAdmin = await User.findOne({
    role: USER_ROLES.SUPERADMIN,
  });

  if (!isExistSuperAdmin) {
    await User.create(superUser);
    logger.info(colors.green('✔ Super admin created successfully!'));
  }
};

export default seedSuperAdmin;
