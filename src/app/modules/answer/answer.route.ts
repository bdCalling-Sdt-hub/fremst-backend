import express from 'express';
import { AnswerController } from './answer.controller';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { AnswerValidation } from './answer.validation';

const router = express.Router();

router.post(
  '/create',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPERADMIN),
  validateRequest(AnswerValidation.createAnswerZodSchema),
  AnswerController.createAnswer
);
router.get('/', AnswerController.getAllAnswers);
router.get('/:id', AnswerController.getAnswerById);
router.patch(
  '/:id',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPERADMIN),
  validateRequest(AnswerValidation.updateAnswerZodSchema),
  AnswerController.updateAnswer
);
router.delete(
  '/:id',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPERADMIN),
  AnswerController.deleteAnswer
);

export const AnswerRoutes = router;
