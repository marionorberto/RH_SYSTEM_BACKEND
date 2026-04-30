// backend/src/modules/nacionality/interfaces/nacionality.interface.ts
export interface INacionality {
  id: string;
  isocode: string;
  nomeNacionalidade: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface INacionalityResponse {
  statusCode: number;
  method: string;
  message: string;
  data?: any;
  path: string;
  timestamp: number;
}
