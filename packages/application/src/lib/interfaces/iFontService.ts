import { Expose } from 'class-transformer';
import * as text2matrix from 'text2matrix';

export class FontData {
  @Expose()
  name!: string;
}

export type Font = FontData & {
  font: text2matrix.Font;
};

export interface IFontService {
  getFont(name: string): Promise<Font | null>;
  getAllFontsData(): Promise<FontData[]>;
  getDefaultFontData(): Promise<FontData>;
}
