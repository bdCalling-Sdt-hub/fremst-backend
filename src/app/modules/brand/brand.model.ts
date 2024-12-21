import { Schema, model } from 'mongoose';
import { IBrand, BrandModel } from './brand.interface';

const brandSchema = new Schema<IBrand, BrandModel>(
  {
    name: { type: String, required: true },
  },
  { timestamps: true }
);
brandSchema.pre('save', async function (next) {
  const isExistBrand = await Brand.findOne({ name: this.name });
  if (isExistBrand) {
    throw new Error('Brand already exists!');
  }
  next();
});
export const Brand = model<IBrand, BrandModel>('Brand', brandSchema);
