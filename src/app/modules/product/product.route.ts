import express from 'express';
import { ProductController } from './product.controller';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { ProductValidation } from './product.validation';
import fileUploadHandler from '../../middlewares/fileUploadHandler';

const router = express.Router();

router.post(
  '/create',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPERADMIN),
  fileUploadHandler(),
  ProductController.createProduct
);
router.get(
  '/',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPERADMIN),
  ProductController.getAllProducts
);
router.get(
  '/:id',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPERADMIN),
  ProductController.getProductById
);
router.patch(
  '/:id',
  fileUploadHandler(),
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPERADMIN),
  ProductController.updateProduct
);
router.delete(
  '/:id',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPERADMIN),
  ProductController.deleteProduct
);

export const ProductRoutes = router;
