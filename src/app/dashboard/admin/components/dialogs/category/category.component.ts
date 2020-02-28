import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CategoriesService } from 'src/app/services/categories.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ICONS } from 'src/app/shared/globals';

@Component({
  selector: 'orf-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit, OnDestroy {

  icons: any[] = ICONS;
  catForm: FormGroup;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private dialogRef: MatDialogRef<CategoryComponent>,
    private cs: CategoriesService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public category: any
  ) { }

  ngOnInit() {
    this.buildForm();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  private buildForm(): void {
    this.catForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      icon: ['', Validators.required]
    })

    if (this.category) {
      this.catForm.get('name').setValue(this.category.name);
      this.catForm.get('icon').setValue(this.category.icon);
    }
  }

  save(): void {
    const form = this.catForm.value;

    if (this.category) {
      this.updateCategory(form);
    }
    else {
      this.createCategory(form);
    }
  }
  
  delete(): void {
    const sub = this.cs.delete(this.category._id).subscribe((response) => {
      if (response) {
        this.dialogRef.close(true);
      }
    })
    this.subscriptions.add(sub);
  }

  private updateCategory(catForm: any): void {
    const sub = this.cs.update(catForm, this.category._id).subscribe((response) => {
      if (response) {
        this.dialogRef.close(true);
      }
    })
    this.subscriptions.add(sub);
  }

  private createCategory(catForm: any): void {
    const sub = this.cs.create(catForm).subscribe((response) => {
      if (response) {
        this.dialogRef.close(true);
      }
    })
    this.subscriptions.add(sub);
  }
}
