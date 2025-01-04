import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { PdfController } from './pdf.controller';
const router = express.Router();
const rolesOfAccess = Object.values(USER_ROLES);
router.post('/create/:id', PdfController.generatePdf);

export const PdfRoutes = router;
