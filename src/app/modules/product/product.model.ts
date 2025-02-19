import { Schema, model } from 'mongoose';
import { IProduct, ProductModel } from './product.interface';

const productSchema = new Schema<IProduct, ProductModel>(
  {
    image: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      required: false,
      default: '',
    },
  },
  { timestamps: true }
);

productSchema.pre('save', async function (next) {
  next();
});

export const Product = model<IProduct, ProductModel>('Product', productSchema);
