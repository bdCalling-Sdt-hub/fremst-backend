import { Model, Types } from 'mongoose';

export type IQuestion = {
  product: Types.ObjectId;
  question: string;
  category: Types.ObjectId;
  isComment: boolean;
};

export type QuestionModel = Model<IQuestion>;
