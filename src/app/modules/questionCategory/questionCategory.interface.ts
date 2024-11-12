import { Model, Types } from 'mongoose';

export type IQuestionCategory = {
  name: string;
  product: Types.ObjectId
};

export type QuestionCategoryModel = Model<IQuestionCategory>;
