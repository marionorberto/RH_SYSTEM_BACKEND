// backend/src/modules/departament/interfaces/departament.interface.ts
export interface IDepartament {
  id: string;
  departamentName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IDepartamentResponse {
  statusCode: number;
  method: string;
  message: string;
  data?: any;
  path: string;
  timestamp: number;
}
