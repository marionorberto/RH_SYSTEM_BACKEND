// backend/src/modules/function/interfaces/function.interface.ts
export interface IFunction {
  id: string;
  functionName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IFunctionResponse {
  statusCode: number;
  method: string;
  message: string;
  data?: any;
  path: string;
  timestamp: number;
}
