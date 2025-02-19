import express from 'express';
import { EmployeeController } from './employee.controller';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { EmployeeValidation } from './employee.validation';

const router = express.Router();
const rolesOfAccess = [
  USER_ROLES.ADMIN,
  USER_ROLES.SUPERADMIN,
  USER_ROLES.CUSTOMER,
];
router.post(
  '/create',
  auth(...rolesOfAccess),
  validateRequest(EmployeeValidation.createEmployeeZodSchema),
  EmployeeController.createEmployee
);
router.get('/', EmployeeController.getAllEmployees);
router.get('/:id', EmployeeController.getEmployeeById);
router.patch(
  '/:id',
  auth(...rolesOfAccess),
  validateRequest(EmployeeValidation.updateEmployeeZodSchema),
  EmployeeController.updateEmployee
);
router.delete(
  '/:id',
  auth(...rolesOfAccess),
  EmployeeController.deleteEmployee
);

export const EmployeeRoutes = router;
