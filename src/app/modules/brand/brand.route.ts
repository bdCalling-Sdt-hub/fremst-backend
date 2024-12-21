import express from 'express';
import { BrandController } from './brand.controller';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { BrandValidation } from './brand.validation';

const router = express.Router();
const rolesOfAccess = [USER_ROLES.ADMIN, USER_ROLES.SUPERADMIN];
router.post(
  '/create',
  auth(...rolesOfAccess),
  validateRequest(BrandValidation.createBrandZodSchema),
  BrandController.createBrand
);
router.get('/', BrandController.getAllBrands);
router.get('/:id', BrandController.getBrandById);
router.patch(
  '/:id',
  auth(...rolesOfAccess),
  validateRequest(BrandValidation.updateBrandZodSchema),
  BrandController.updateBrand
);
router.delete('/:id', auth(...rolesOfAccess), BrandController.deleteBrand);

export const BrandRoutes = router;
