import { Expose } from 'class-transformer';

export class FontData {
  @Expose()
  name!: string;
}

export type Font = FontData & {
  font: Buffer;
};

export interface IFontService {
  getFont(name: string): Promise<Font | null>;
  getAllFontsData(): Promise<FontData[]>;
  getDefaultFontData(): Promise<FontData>;
}
