import express from 'express';
import { OldInspectionController } from './oldInspection.controller';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { OldInspectionValidation } from './oldInspection.validation';
import fileUploadHandler from '../../middlewares/fileUploadHandler';

const router = express.Router();

router.post(
  '/create',
  auth(USER_ROLES.ADMIN, USER_ROLES.CUSTOMER, USER_ROLES.SUPERADMIN),
  fileUploadHandler(),
  OldInspectionController.createOldInspection
);
router.get('/', OldInspectionController.getAllOldInspections);
router.get(
  '/history',
  OldInspectionController.getOldInspectionByProductAndCustomer
);
router.get('/:id', OldInspectionController.getOldInspectionById);
router.patch(
  '/:id',
  auth(USER_ROLES.ADMIN, USER_ROLES.CUSTOMER, USER_ROLES.SUPERADMIN),
  fileUploadHandler(),
  OldInspectionController.updateOldInspection
);
router.get('/download/:id', OldInspectionController.downloadFile);
router.delete(
  '/:id',
  auth(USER_ROLES.ADMIN, USER_ROLES.CUSTOMER, USER_ROLES.SUPERADMIN),
  OldInspectionController.deleteOldInspection
);

export const OldInspectionRoutes = router;
