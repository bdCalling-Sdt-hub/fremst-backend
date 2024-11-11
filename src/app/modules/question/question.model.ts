import { Schema, model } from 'mongoose';
import { IQuestion, QuestionModel } from './question.interface';

const questionSchema = new Schema<IQuestion, QuestionModel>(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    question: { type: String, required: true },
    answer: { type: String, required: true },
    isYes: { type: Boolean, required: true },
  },
  { timestamps: true }
);

export const Question = model<IQuestion, QuestionModel>(
  'Question',
  questionSchema
);
