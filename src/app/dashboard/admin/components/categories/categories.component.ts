import { Component, OnInit, OnDestroy } from '@angular/core';
import { CategoriesService } from 'src/app/services/categories.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material';
import { CategoryComponent } from 'src/app/dashboard/admin/components/dialogs/category/category.component';

@Component({
  selector: 'orf-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit, OnDestroy {

  categories: any[] = [];
  private subscriptions: Subscription = new Subscription();

  constructor(
    private dialog: MatDialog,
    private cs: CategoriesService
  ) { }

  ngOnInit() {
    this.getCategories();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  private getCategories(): void {
    const sub = this.cs.getAll().subscribe((categories) => {
      this.categories = categories;
    })
    this.subscriptions.add(sub);
  }

  editCategory(category: any): void {
    const dialog = this.dialog.open(CategoryComponent, {
      data: category
    });

    dialog.afterClosed().subscribe((confirm) => {
      if (confirm) {
        this.getCategories();
      }
    })
  }
}
