import { Model, Types } from 'mongoose';

export type IAnswer = {
  question: Types.ObjectId;
  comment?: string;
  isYes: boolean;
};

export type AnswerModel = Model<IAnswer>;
