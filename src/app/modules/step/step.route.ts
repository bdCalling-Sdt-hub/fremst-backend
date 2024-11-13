import express from 'express';
import { StepController } from './step.controller';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { StepValidation } from './step.validation';

const router = express.Router();

router.post(
  '/create',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPERADMIN),
  validateRequest(StepValidation.createStepZodSchema),
  StepController.createStep
);
router.get('/product/:productID', StepController.getAllStepsByProductID);
router.get('/:id', StepController.getStepById);
router.patch(
  '/:id',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPERADMIN),
  validateRequest(StepValidation.updateStepZodSchema),
  StepController.updateStep
);
router.delete(
  '/:id',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPERADMIN),
  StepController.deleteStep
);

export const StepRoutes = router;
