import express from 'express';
import { InspectionController } from './inspection.controller';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import fileUploadHandler from '../../middlewares/fileUploadHandler';

const router = express.Router();

router.post(
  '/create',
  auth(USER_ROLES.ADMIN, USER_ROLES.CUSTOMER, USER_ROLES.SUPERADMIN),
  fileUploadHandler(),
  InspectionController.createInspection
);
router.get(
  '/',
  auth(USER_ROLES.ADMIN, USER_ROLES.CUSTOMER, USER_ROLES.SUPERADMIN),
  InspectionController.getAllInspections
);
router.get('/inspect/:id', InspectionController.getFullInspectionInfo);
router.get('/:id', InspectionController.getInspectionById);
router.patch(
  '/:id',
  auth(USER_ROLES.ADMIN, USER_ROLES.CUSTOMER, USER_ROLES.SUPERADMIN),
  InspectionController.updateInspection
);

router.delete(
  '/:id',
  auth(USER_ROLES.ADMIN, USER_ROLES.CUSTOMER, USER_ROLES.SUPERADMIN),
  InspectionController.deleteInspection
);
export const InspectionRoutes = router;
