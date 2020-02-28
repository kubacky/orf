import { Category } from "./category";

export class User {
  email: string;
  name: string;
  company: string;
  type: string;
  permissions: string;
  canManage: Category[];
  isAdmin: boolean;
  limit: number;
  agreement: boolean;
  active: boolean;
}
