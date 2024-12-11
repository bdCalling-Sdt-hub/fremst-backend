import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
import validateRequest from '../../middlewares/validateRequest';
import { UserController } from './user.controller';
import { UserValidation } from './user.validation';
const router = express.Router();

router.get(
  '/profile',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPERADMIN),
  UserController.getUserProfile
);

router
  .route('/')
  .post(
    auth(USER_ROLES.SUPERADMIN),
    validateRequest(UserValidation.createUserZodSchema),
    UserController.createUser
  )
  .patch(
    auth(USER_ROLES.ADMIN, USER_ROLES.SUPERADMIN),
    fileUploadHandler(),
    UserController.updateProfile
  );
router.post('/hold/:id', auth(USER_ROLES.SUPERADMIN), UserController.holdUser);
router.get(
  '/isHold/:id',
  auth(USER_ROLES.SUPERADMIN, USER_ROLES.ADMIN),
  UserController.isHold
);
router.get('/admins', auth(USER_ROLES.SUPERADMIN), UserController.getAdmins);
router.get(
  '/home',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPERADMIN),
  UserController.getHomeData
);
router.get(
  '/admins/:id',
  auth(USER_ROLES.SUPERADMIN),
  UserController.getAdminByID
);
router.delete(
  '/admins/:id',
  auth(USER_ROLES.SUPERADMIN),
  UserController.deleteAdminByID
);

export const UserRoutes = router;
