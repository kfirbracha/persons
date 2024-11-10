import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject, signal } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { AddressComponent } from "../address/address.component";
import { SuccessComponent } from "../shared/components/dialogs/success/success.component";
import { Address } from "../shared/interfaces/address.interface";
import { HttpService } from "../shared/services/http.service";
@Component({
  selector: "app-add-user",
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
    MatDialogModule,
  ],
  templateUrl: "./add-user.component.html",
  styleUrl: "./add-user.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddUserComponent {
  private fb = inject(FormBuilder);
  private httpService = inject(HttpService);
  private dialog = inject(MatDialog);

  public form = this.fb.group({
    name: [null, [Validators.required]],
    birthdate: [new Date()],
    addresses: this.fb.array([]),
  });

  public addressesArr = signal<FormGroup[]>([]);

  constructor() {
    this.addAddress();
  }
  addAddress(): void {
    const newAddressControl = this.createAddressControl();

    (this.form.get("addresses") as FormArray).push(newAddressControl);

    this.addressesArr.update((addresses) => [...addresses, newAddressControl]);
  }

  removeAddress(index: number): void {
    if (this.addressesArr()?.length !== 1) {
      this.addressesArr.update((addresses) => addresses.filter((_, i) => i !== index));
      this.form.controls.addresses.removeAt(index);
    }
  }

  updateAddress(index: number, value: Address): void {
    const formControl = this.form.controls.addresses.controls[index];

    if (JSON.stringify(formControl.value) !== JSON.stringify(value)) {
      this.form.controls.addresses.controls[index].patchValue(value);
      this.addressesArr.update((addresses) => {
        const newAddresses = [...addresses];
        newAddresses[index].patchValue(value);
        return newAddresses;
      });
    }
  }

  private createAddressControl(): FormGroup {
    return this.fb.group({
      name: ["", Validators.required],
      country: [""],
      city: [""],
      street: ["", Validators.required],
    });
  }

  public addUser() {
    const addresses = this.form.controls.addresses.value;
    const value = { ...this.form.value, addresses };
    console.log(value);
    console.log(this.form.errors);

    if (this.form.valid) {
      this.httpService.post("person", value).subscribe((value) => {
        if (value) {
          this.dialog.open(SuccessComponent);
        }
      });
    } else {
      this.form.markAllAsTouched();
    }
  }
}
