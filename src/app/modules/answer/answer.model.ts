import { Schema, model } from 'mongoose';
import { IAnswer, AnswerModel } from './answer.interface';

const answerSchema = new Schema<IAnswer, AnswerModel>(
  {
    question: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
    comment: { type: String, required: false },
    isYes: { type: Boolean, required: true },
  },
  { timestamps: true }
);

export const Answer = model<IAnswer, AnswerModel>('Answer', answerSchema);
