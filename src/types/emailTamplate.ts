export type ICreateAccount = {
  name: string;
  email: string;
  otp: number;
};

export type IResetPassword = {
  email: string;
  otp: number;
};

export type IUpcommingInspection = {
  email: string;
  productName: string;
  inspectionDate: string;
  inspectionTime: string;
};
export type IAddedUserReminder = {
  email: string;
  name: string;
  password: string;
};
