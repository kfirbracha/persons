import { City } from './city.interface';

export interface Country {
  id: number;
  name: string;
  cities: City;
}
