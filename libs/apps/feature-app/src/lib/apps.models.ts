import { Expose } from 'class-transformer';

export class AppData {
  @Expose()
  name!: string;
}

export class App extends AppData {
  @Expose()
  file!: string;
}
