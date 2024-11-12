import { Schema, model } from 'mongoose';
import { IQuestion, QuestionModel } from './question.interface';
import { StatusCodes } from 'http-status-codes';
import { Product } from '../product/product.model';
import ApiError from '../../../errors/ApiError';
import { QuestionCategory } from '../questionCategory/questionCategory.model';

const questionSchema = new Schema<IQuestion, QuestionModel>(
  {
    category: {
      type: Schema.Types.ObjectId,
      ref: 'QuestionCategory',
      required: true,
    },
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    question: { type: String, required: true },
    isComment: { type: Boolean, required: true },
  },
  { timestamps: true }
);

questionSchema.pre('save', async function (next) {
  const isExistProduct = await Product.findOne({ _id: this.product });
  if (!isExistProduct) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Product not found!');
  }
  const isExistCategory = await QuestionCategory.findOne({
    _id: this.category,
  });
  if (!isExistCategory) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'QuestionCategory not found!');
  }
  next();
});

export const Question = model<IQuestion, QuestionModel>(
  'Question',
  questionSchema
);
