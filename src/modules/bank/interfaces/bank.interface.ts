// backend/src/modules/bank/interfaces/bank.interface.ts
export interface IBank {
  id: string;
  bank_name: string;
  sigla: string;
  code: string;
  createdAt: Date;
  updatedAt: Date;
}
