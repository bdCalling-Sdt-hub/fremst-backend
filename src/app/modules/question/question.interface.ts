import { Model, Types } from 'mongoose';

export type IQuestion = {
  product: Types.ObjectId;
  question: string;
  stepID: Types.ObjectId;
  isComment: boolean;
};

export type QuestionModel = Model<IQuestion>;
