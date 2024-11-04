import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { Address } from '../shared/interfaces/address.interface';

@Component({
  selector: 'app-address',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './address.component.html',
  styleUrl: './address.component.scss',
})
export class AddressComponent {
  @Input() addressForm!: FormGroup;
  @Output() addressChange = new EventEmitter<Address>();

  countries = ['USA', 'Canada', 'UK'];
  cities: { [key: string]: string[] } = {
    USA: ['New York', 'Los Angeles', 'Chicago'],
    Canada: ['Toronto', 'Vancouver', 'Montreal'],
    UK: ['London', 'Manchester', 'Birmingham'],
  };

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    if (!this.addressForm) {
      this.addressForm = this.fb.group({
        name: ['', Validators.required],
        country: ['', Validators.required],
        city: ['', Validators.required],
        street: ['', Validators.required],
      });
    }

    this.addressForm.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((value) => {
        console.log(value, this.addressForm.value);
        this.addressChange.emit(value);
      });

    this.addressForm.get('country')?.valueChanges.subscribe(() => {
      this.addressForm.patchValue({ city: '' });
    });
  }
}
