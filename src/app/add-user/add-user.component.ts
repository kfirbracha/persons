import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AddressComponent } from '../address/address.component';
import { Address } from '../shared/interfaces/address.interface';
@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
    MatButtonModule,
    AddressComponent,
    MatSelectModule,
  ],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss',
})
export class AddUserComponent {
  private fb = inject(FormBuilder);

  public form = this.fb.group({
    userName: ['', [Validators.required]],
    birthDate: [null],
    addresses: [new FormArray([this.createAddressControl()])],
  });

  public addresses = signal<FormGroup[]>([this.createAddressControl()]);

  addAddress(): void {
    this.addresses.update((addresses) => [
      ...addresses,
      this.createAddressControl(),
    ]);
    // this.form.controls.addresses.setValue(this.addresses());
  }

  removeAddress(index: number): void {
    this.addresses.update((addresses) =>
      addresses.filter((_, i) => i !== index)
    );
  }

  updateAddress(index: number, value: Address): void {
    this.addresses.update((addresses) => {
      const newAddresses = [...addresses];
      newAddresses[index].patchValue(value);
      return newAddresses;
    });

    (this.form.controls.addresses.value as unknown as FormArray).controls[
      index
    ].patchValue(value);
    console.log(
      (this.form.controls.addresses.value as unknown as FormArray).value
    );
  }

  private createAddressControl(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      country: [''],
      city: [''],
      street: ['', Validators.required],
    });
  }

  public addUser() {
    const addresses = (
      this.form.controls.addresses.value as unknown as FormArray
    ).value;
    const value = { ...this.form.value, addresses };

    console.log({ addresses });

    console.log(value);
  }
}
