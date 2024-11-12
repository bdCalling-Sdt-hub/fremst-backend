import { Schema, model } from 'mongoose';
import { IQuestionCategory, QuestionCategoryModel } from './questionCategory.interface';

const questionCategorySchema = new Schema<IQuestionCategory, QuestionCategoryModel>({
  name: { type: String, required: true },
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true }
}, { timestamps: true });

export const QuestionCategory = model<IQuestionCategory, QuestionCategoryModel>('QuestionCategory', questionCategorySchema);
