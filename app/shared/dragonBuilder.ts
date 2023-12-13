import {
  uniqueNamesGenerator,
  names,
  colors,
  animals,
} from 'unique-names-generator';
import { placeholder } from './breeds';
import type { PartialLineageWithMetadata, PartialLineage } from './types';

export class DragonBuilder {
  public static createWithMetadata(
    attributes: Partial<PartialLineageWithMetadata> = {},
  ): PartialLineageWithMetadata {
    return {
      ...this.create(),
      selected: false,
      ...attributes,
    } as PartialLineageWithMetadata;
  }

  public static create(
    attributes: Partial<PartialLineage> = {},
  ): PartialLineage {
    return {
      code: this.generateCode(),
      name: this.generateName(),
      parents: {},
      breed: placeholder.name,
      gender: 'm',
      display: 1,
      ...attributes,
    };
  }

  public static generateCode(): string {
    const characters =
      '1234567890ABCDEFGHIJKLMNOPQRTUVWXYZabcdefghijklmnopqrstuvwyz';
    let str = '';
    for (let i = 0; i < 5; ++i) {
      str += characters[~~(Math.random() * characters.length)];
    }
    return str;
  }

  public static generateName(): string {
    return uniqueNamesGenerator({
      dictionaries: [names, colors, animals],
      length: 2,
      separator: ' ',
      style: 'capital',
    });
  }
}
