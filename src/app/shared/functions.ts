import { Injectable } from '@angular/core';

@Injectable()
export class Functions {

  searchIndex(table: any, fieldName: string, query: any) {
    const tl = table.length;
    for (let i = 0; i < tl; i++) {
      if (table[i][fieldName] == query) {
        return i;
      }
    }
    return false;
  }
}