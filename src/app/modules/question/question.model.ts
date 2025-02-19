import { Schema, model } from 'mongoose';
import { IQuestion, QuestionModel } from './question.interface';
import { StatusCodes } from 'http-status-codes';
import { Product } from '../product/product.model';
import ApiError from '../../../errors/ApiError';
import { Step } from '../step/step.model';

const questionSchema = new Schema<IQuestion, QuestionModel>(
  {
    stepID: {
      type: Schema.Types.ObjectId,
      ref: 'Step',
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
  const isExistStep = await Step.findOne({
    _id: this.stepID,
  });
  if (!isExistStep) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'step not found!');
  }
  next();
});

export const Question = model<IQuestion, QuestionModel>(
  'Question',
  questionSchema
);
