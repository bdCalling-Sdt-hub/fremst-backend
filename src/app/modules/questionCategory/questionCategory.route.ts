import express from 'express';
import { QuestionCategoryController } from './questionCategory.controller';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { QuestionCategoryValidation } from './questionCategory.validation';

const router = express.Router();

router.post(
  '/create',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPERADMIN),
  validateRequest(QuestionCategoryValidation.createQuestionCategoryZodSchema),
  QuestionCategoryController.createQuestionCategory
);
router.get('/', QuestionCategoryController.getAllQuestionCategorys);
router.get('/:id', QuestionCategoryController.getQuestionCategoryById);
router.patch(
  '/:id',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPERADMIN),
  validateRequest(QuestionCategoryValidation.updateQuestionCategoryZodSchema),
  QuestionCategoryController.updateQuestionCategory
);
router.delete(
  '/:id',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPERADMIN),
  QuestionCategoryController.deleteQuestionCategory
);

export const QuestionCategoryRoutes = router;
