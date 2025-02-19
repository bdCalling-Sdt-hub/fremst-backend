import { Model, Types } from 'mongoose';
  
  export type IEmployee = {
    name: string;
  company: Types.ObjectId
  };
  
  export type EmployeeModel = Model<IEmployee>;
