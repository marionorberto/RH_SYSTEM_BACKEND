// backend/src/modules/company-data/interfaces/company-data.interface.ts
export interface ICompanyData {
  id: string;
  companyName: string;
  companyNIF: string;
  tickectModel?: string;
  smtpEmail?: string;
  smtpPassword?: string;
  SocialSecurityPassword?: string;
  corporativeEmail?: string;
  linkedin?: string;
  whatsapp?: string;
  instagram?: string;
  phone1?: string;
  phone2?: string;
  street?: string;
  neighbourhood?: string;
  houseNumber?: string;
  fax?: string;
  logotipo64?: string;
  postalCode?: string;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICompanyDataResponse {
  statusCode: number;
  method: string;
  message: string;
  data?: any;
  path: string;
  timestamp: number;
}
