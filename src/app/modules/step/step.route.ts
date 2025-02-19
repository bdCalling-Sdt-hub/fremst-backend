import express from 'express';
import { StepController } from './step.controller';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { StepValidation } from './step.validation';
import fileUploadHandler from '../../middlewares/fileUploadHandler';

const router = express.Router();

router.post(
  '/create',
  auth(USER_ROLES.ADMIN, USER_ROLES.CUSTOMER, USER_ROLES.SUPERADMIN),
  fileUploadHandler(),
  StepController.createStep
);
router.get('/product/:productID', StepController.getAllStepsByProductID);
router.get('/:id', StepController.getStepById);
router.patch(
  '/:id',
  auth(USER_ROLES.ADMIN, USER_ROLES.CUSTOMER, USER_ROLES.SUPERADMIN),
  fileUploadHandler(),
  StepController.updateStep
);
router.delete(
  '/:id',
  auth(USER_ROLES.ADMIN, USER_ROLES.CUSTOMER, USER_ROLES.SUPERADMIN),
  StepController.deleteStep
);

export const StepRoutes = router;
