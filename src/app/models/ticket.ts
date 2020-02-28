import { Category } from "src/app/models/category";

export class Ticket {
  name: string;
  status: boolean;
  for: Category[];
}
