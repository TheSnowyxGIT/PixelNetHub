export interface IType {
  name: string;
  schema: Record<string, any>;
  validate(value: any): Promise<void>;
  transform(value: any): Promise<any>;
}

export class TypesManager {
  private types: Map<string, IType> = new Map();

  public register(type: IType): void {
    this.types.set(type.name, type);
  }

  public has(type: string): boolean {
    return this.types.has(type);
  }

  public getSchema(type: string): Record<string, any> | undefined {
    return this.types.get(type)?.schema;
  }

  public async validate(type: string, value: any): Promise<void> {
    const iType = this.types.get(type);
    if (!iType) return;
    await iType.validate(value);
  }

  public async transform(type: string, value: any): Promise<any> {
    const iType = this.types.get(type);
    if (!iType) return value;
    return await iType.transform(value);
  }
}
