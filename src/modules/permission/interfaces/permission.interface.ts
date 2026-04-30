// backend/src/modules/permission/interfaces/permission.interface.ts
export interface IPermission {
  id: string;
  nomePermission: string;
  descricaoPermission?: string;
  createdAt: Date;
  updatedAt: Date;
}
