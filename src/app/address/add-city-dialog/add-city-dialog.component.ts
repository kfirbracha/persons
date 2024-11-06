import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Country } from '../../shared/interfaces/country.interface';
import { HttpService } from '../../shared/services/http.service';
@Component({
  selector: 'app-add-city-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    JsonPipe,
  ],
  templateUrl: './add-city-dialog.component.html',
  styleUrl: './add-city-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddCityDialogComponent {
  private dialogRef = inject(MatDialogRef);
  public readonly country: Country = inject(MAT_DIALOG_DATA);
  private httpService = inject(HttpService);
  private fb = inject(FormBuilder);
  public form = this.fb.group({
    city: ['', Validators.required],
  });

  public handlerAddCity() {
    console.log(this.form.value.city);

    if (this.form.valid) {
      this.httpService
        .post(`city`, {
          countryId: this.country.id,
          name: this.form.value.city,
        })
        .subscribe({
          next: (value) => {
            console.log({ value });
            this.dialogRef.close(value);
          },
          error: (error) => {
            console.error({ error });
            this.form.controls.city.setErrors({
              isServiceError:
                'Something went wrong. Please try again.  Error: ',
            });
          },
        });
    }
  }

  public handlerCloseDialog() {
    console.log(this.dialogRef);
    this.dialogRef.close();
  }
}
