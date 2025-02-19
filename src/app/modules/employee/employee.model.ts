import { Schema, model } from 'mongoose';
  import { IEmployee, EmployeeModel } from './employee.interface';
  
  const employeeSchema = new Schema<IEmployee, EmployeeModel>({
    name: { type: String, required: true },
  company: { type: Schema.Types.ObjectId, ref: 'undefined', required: true }
  }, { timestamps: true });
  
  export const Employee = model<IEmployee, EmployeeModel>('Employee', employeeSchema);
