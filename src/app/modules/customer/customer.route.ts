import express from 'express';
import { CustomerController } from './customer.controller';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { CustomerValidation } from './customer.validation';

const router = express.Router();

router.post(
  '/add',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPERADMIN),
  validateRequest(CustomerValidation.createCustomerZodSchema),
  CustomerController.createCustomer
);
router.get('/all', CustomerController.getAllCustomers);
router.get('/all/lean', CustomerController.getAllCustomersLean);
router.get('/:id', CustomerController.getCustomerById);
router.patch(
  '/:id',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPERADMIN),
  validateRequest(CustomerValidation.updateCustomerZodSchema),
  CustomerController.updateCustomer
);
router.delete(
  '/:id',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPERADMIN),
  CustomerController.deleteCustomer
);

export const CustomerRoutes = router;
