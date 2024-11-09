import express from 'express';
import { CustomerController } from './customer.controller';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { CustomerValidation } from './customer.validation';

const router = express.Router();

router.post(
  '/create',
  auth(USER_ROLES.ADMIN),
  validateRequest(CustomerValidation.createCustomerZodSchema),
  CustomerController.createCustomer
);
router.get('/', CustomerController.getAllCustomers);
router.get('/:id', CustomerController.getCustomerById);
router.patch(
  '/:id',
  auth(USER_ROLES.ADMIN),
  validateRequest(CustomerValidation.updateCustomerZodSchema),
  CustomerController.updateCustomer
);
router.delete('/:id', auth(USER_ROLES.ADMIN), CustomerController.deleteCustomer);

export const CustomerRoutes = router;