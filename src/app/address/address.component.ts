import { CommonModule } from "@angular/common";
import { Component, EventEmitter, inject, Input, Output, signal } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { debounceTime, distinctUntilChanged } from "rxjs";
import { Address } from "../shared/interfaces/address.interface";
import { City } from "../shared/interfaces/city.interface";
import { Country } from "../shared/interfaces/country.interface";
import { HttpService } from "../shared/services/http.service";
import { LoggerService } from "../shared/services/logger/logger.service";
import { AddCityDialogComponent } from "./add-city-dialog/add-city-dialog.component";
@Component({
  selector: "app-address",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatDialogModule],
  templateUrl: "./address.component.html",
  styleUrl: "./address.component.scss",
})
export class AddressComponent {
  @Input() addressForm!: FormGroup;
  @Output() addressChange = new EventEmitter<Address>();

  private dialog = inject(MatDialog);
  private httpService = inject(HttpService);
  private logger = inject(LoggerService);

  countries = signal<Country[]>([]);
  cities = signal<City[]>([]);

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.getCountriesAndCitiesData();

    if (!this.addressForm) {
      this.addressForm = this.fb.group({
        name: ["", Validators.required],
        country: ["", Validators.required],
        city: ["", Validators.required],
        street: ["", Validators.required],
      });
    }
    this.addressForm.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr))
      )
      .subscribe((value) => {
        this.addressChange.emit(value);
      });

    this.addressForm.get("country")?.valueChanges.subscribe(() => {
      this.addressForm.patchValue({ city: "" });
    });
  }

  public getCountriesAndCitiesData() {
    this.httpService.get<Country[]>("countries").subscribe((val) => {
      this.countries.set(val);
      if (!this.addressForm.get("country")?.value) {
        this.addressForm.controls["country"].setValue(this.countries()[0].id);
      }
      this.httpService.get<City[]>(`cities/${this.addressForm.get("country")?.value}`).subscribe((val) => {
        this.cities.set(val);
      });
    });
  }

  public handlerAddCity() {
    this.dialog
      .open(AddCityDialogComponent, {
        height: "200px",
        width: "300px",
        data: this.countries().find((c) => c.id === this.addressForm.value.country),
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.getCountriesAndCitiesData();
        }
      });
  }
}
