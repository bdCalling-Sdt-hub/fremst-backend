import express from 'express';
import { AuthRoutes } from '../app/modules/auth/auth.route';
import { UserRoutes } from '../app/modules/user/user.route';
import { CustomerRoutes } from '../app/modules/customer/customer.route';
import { ProductRoutes } from '../app/modules/product/product.route';
import { QuestionRoutes } from '../app/modules/question/question.route';
import { StepRoutes } from '../app/modules/step/step.route';
import { InspectionRoutes } from '../app/modules/inspection/inspection.route';
import { OldInspectionRoutes } from '../app/modules/oldInspection/oldInspection.route';
import { BrandRoutes } from '../app/modules/brand/brand.route';
const router = express.Router();

const apiRoutes = [
  {
    path: '/user',
    route: UserRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/customer',
    route: CustomerRoutes,
  },
  {
    path: '/question',
    route: QuestionRoutes,
  },
  {
    path: '/question/steps',
    route: StepRoutes,
  },
  {
    path: '/product',
    route: ProductRoutes,
  },
  {
    path: '/inspection',
    route: InspectionRoutes,
  },
  {
    path: '/oldinspection',
    route: OldInspectionRoutes,
  },
  {
    path: '/brand',
    route: BrandRoutes,
  },
];

apiRoutes.forEach(route => router.use(route.path, route.route));

export default router;
