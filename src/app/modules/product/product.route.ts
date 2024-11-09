import express from 'express';
import { ProductController } from './product.controller';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { ProductValidation } from './product.validation';

const router = express.Router();

router.post(
  '/create',
  auth(USER_ROLES.ADMIN),
  validateRequest(ProductValidation.createProductZodSchema),
  ProductController.createProduct
);
router.get('/', ProductController.getAllProducts);
router.get('/:id', ProductController.getProductById);
router.patch(
  '/:id',
  auth(USER_ROLES.ADMIN),
  validateRequest(ProductValidation.updateProductZodSchema),
  ProductController.updateProduct
);
router.delete('/:id', auth(USER_ROLES.ADMIN), ProductController.deleteProduct);

export const ProductRoutes = router;
