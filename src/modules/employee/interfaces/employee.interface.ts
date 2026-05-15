// backend/src/modules/employee/interfaces/employee.interface.ts
export interface IEmployee {
  id: string;
  employee_name: string;
  fatherName?: string;
  motherName: string;
  birthday: Date;
  gender: string;
  civilState?: string;
  idNacionality: string;
  typeDoc1?: string;
  docNumber1?: string;
  typeDoc2?: string;
  docNumber2?: string;
  academic_level?: string;
  photo?: string;
  telefone1?: string;
  telefone2?: string;
  email?: string;
  linkedin?: string;
  whatsapp?: string;
  instagram?: string;
  street?: string;
  neighbourhood?: string;
  houseNumber?: string;
  idFunction?: string;
  idCategory?: string;
  idBank?: string;
  numSegsocial?: string;
  numContaBanc?: string;
  iBanknta?: string;
  estado: boolean;
  createdAt: Date;
  updatedAt: Date;
  hasUser?: boolean;
}

export interface IEmployeeResponse {
  statusCode: number;
  method: string;
  message: string;
  data?: any;
  path: string;
  timestamp: number;
}