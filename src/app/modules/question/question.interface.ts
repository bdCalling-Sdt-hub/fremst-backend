import { Model, Types } from 'mongoose';

export type IQuestion = {
  product: Types.ObjectId;
  question: string;
  answer: string;
  isYes: boolean;
};

export type QuestionModel = Model<IQuestion>;
