import { emailHelper } from '../../../helpers/emailHelper';
import { emailTemplate } from '../../../shared/emailTemplate';
import { Customer } from '../../modules/customer/customer.model';
import { Product } from '../../modules/product/product.model';
import { User } from '../../modules/user/user.model';

export const upcomingInspectionReminder = async () => {
  const today = new Date();
  const [allAdmin, allProducts, allCustomer] = await Promise.all([
    User.find(),
    Product.find({}),
    Customer.find(),
  ]);
  for (const product of allProducts) {
    const nextInspectionDate = new Date(product.nextInspectionDate);
    if (nextInspectionDate.getDate() >= today.getDate()) {
      for (const admin of allAdmin) {
        await emailHelper.sendEmail(
          emailTemplate.upcomingInspectionReminder({
            email: admin.email,
            productName: product.name,
            inspectionDate: new Date(product.nextInspectionDate).getDate(),
          })
        );
      }
      for (const customer of allCustomer) {
        await emailHelper.sendEmail(
          emailTemplate.upcomingInspectionReminder({
            email: customer.email,
            productName: product.name,
            inspectionDate: new Date(product.nextInspectionDate).getDate(),
          })
        );
      }
    }
  }
};
