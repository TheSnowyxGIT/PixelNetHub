import { buildYup } from 'schema-to-yup';
import { TypesManager } from './type-manager';

export interface OptionsSchema {
  [key: string]: {
    type: string;
    [key: string]: any;
  };
}

export class OptionValidator {
  private types: Record<string, string> = {};
  private yupSchema?: ReturnType<typeof buildYup>;
  private options: any = {};

  constructor(
    options: any,
    optionSchema: OptionsSchema,
    private readonly typesManager: TypesManager
  ) {
    this.options = options ?? {};
    this.buildSchema(optionSchema);
  }

  public async validate(): Promise<void> {
    this.options = await this.yupSchema!.validate(this.options);
    for (const key of Object.keys(this.options)) {
      const type = this.types[key];
      await this.typesManager.validate(type, this.options[key]);
    }
  }

  public async transform(): Promise<any> {
    this.options = await this.yupSchema!.validate(this.options);
    const result = this.options;
    for (const key of Object.keys(this.types)) {
      const type = this.types[key];
      const value = await this.typesManager.transform(type, result[key]);
      if (value !== undefined) result[key] = value;
    }
    return result;
  }

  private buildSchema(option: OptionsSchema): any {
    this.types = {};
    const schemaYupProperties: Record<string, any> = {};
    Object.keys(option).forEach((propertyName) => {
      const propertySchema = option[propertyName as string];
      const { type, ...rest } = propertySchema;
      let content = {};
      if (this.typesManager.has(type)) {
        content = this.typesManager.getSchema(type)!;
        this.types[propertyName] = type;
      } else {
        content = { type };
      }
      schemaYupProperties[propertyName] = { ...content, ...rest };
    });
    const schema = {
      $schema: 'http://json-schema.org/draft-07/schema#',
      $id: 'http://example.com/person.schema.json',
      title: 'todo',
      description: 'todo',
      type: 'object',
      properties: schemaYupProperties,
    };
    this.yupSchema = buildYup(schema);
  }
}
