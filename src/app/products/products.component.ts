import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { ProductFormComponent } from '../product-form/product-form.component';
import { MatSnackBar } from '@angular/material/snack-bar';

interface Product {
  id: number;
  name: string;
  active: boolean;
  createdAt: Date;
  createdBy: string;
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    RouterModule
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {
  private http = inject(HttpClient);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  displayedColumns: string[] = ['id', 'name', 'active', 'actions']
  products: Product[] = []

  ngOnInit() {
    this.loadProducts()
  }

  loadProducts() {
    this.http.get<Product[]>('http://localhost:8080/api/v1/products')
      .subscribe(data => this.products = data)
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(ProductFormComponent, {
      width: '500px',
      data: {
        isEdit: false,
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.loadProducts();
      }
    });
  }

  openEditDialog(product: Product) {
    const dialogRef = this.dialog.open(ProductFormComponent, {
      width: '500px',
      data: {
        ...product,
        isEdit: true,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.showSuccess('Produto atualizado com sucesso!');
        this.loadProducts();
      }
    });
  }

  deleteProduct(id: number) {
    this.http.delete(`http://localhost:8080/api/v1/products/${id}`, { responseType: 'text' })
      .subscribe(() => this.loadProducts())
  }

  private showSuccess(message: string) {
    this.snackBar.open(message, 'Fechar', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  private showError(message: string) {
    this.snackBar.open(message, 'Fechar', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }
}
