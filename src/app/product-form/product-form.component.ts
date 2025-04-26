import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

interface Product {
  id: number;
  name: string;
  active: boolean;
  createdAt: Date;
  createdBy: string;
  isEdit: boolean;
}

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    MatDatepickerModule
  ],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss'
})
export class ProductFormComponent {
  private fb = inject(FormBuilder)
  private http = inject(HttpClient);
  private snackBar = inject(MatSnackBar);
  private dialogRef = inject(MatDialogRef<ProductFormComponent>);
  public data = inject<Product>(MAT_DIALOG_DATA);

  productForm = this.fb.group({
    name: ['', Validators.required],
    active: [true, Validators.required],
  });

  ngOnInit() {
    if (this.data?.isEdit) {
      this.productForm.patchValue({
        name: this.data.name,
        active: this.data.active,
      });
    }
  }

onSubmit() {
  if(this.productForm.invalid) return;
  const productData = this.productForm.value;

  const request = this.data?.isEdit
    ?this.http.put(`http://localhost:8080/products/${this.data.id}`, productData)
    :this.http.post('http://localhost:8080/products', productData);

  request.subscribe({
    next: () => this.dialogRef.close(true),
    error: (e) => {
      this.snackBar.open(`Erro: ${e.message || "desconhecido"}`, 'Fechar', {
        duration: 5000,
      });
    }
  })
}

  onCancel() {
    this.dialogRef.close();
  }
}
