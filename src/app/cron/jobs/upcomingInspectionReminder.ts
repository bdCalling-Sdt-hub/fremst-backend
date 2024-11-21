import { Types } from 'mongoose';
import { emailHelper } from '../../../helpers/emailHelper';
import { emailTemplate } from '../../../shared/emailTemplate';
import { Customer } from '../../modules/customer/customer.model';
import { Inspection } from '../../modules/inspection/inspection.model';
import { Product } from '../../modules/product/product.model';
import { User } from '../../modules/user/user.model';
import { ICustomer } from '../../modules/customer/customer.interface';

export const upcomingInspectionReminder = async () => {
  const today = new Date();
  const tomorrow = new Date(today.setDate(today.getDate() + 1));
  const productIds = await Inspection.distinct('product customer', {
    isActive: true,
  });
  const inspections = await Inspection.find({}).populate({
    path: 'product customer',
  });
  const admins = await User.find({ role: 'admin' });
  for (const inspection of inspections) {
    const nextInspectionDate = inspection.nextInspectionDate;
    if (nextInspectionDate.toISOString() === tomorrow.toISOString()) {
      const customer: any = inspection.customer;
      const product: any = inspection.product;
      await emailHelper.sendEmail(
        emailTemplate.upcomingInspectionReminder({
          email: customer.email as string,
          productName: product.name,
          inspectionDate: new Date(product.nextInspectionDate).getDate(),
        })
      );
      for (const admin of admins) {
        await emailHelper.sendEmail(
          emailTemplate.upcomingInspectionReminder({
            email: admin.email as string,
            productName: product.name,
            inspectionDate: new Date(product.nextInspectionDate).getDate(),
          })
        );
      }
    }
  }
};
