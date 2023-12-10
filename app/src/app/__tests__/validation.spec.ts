import { describe, it, expect } from 'vitest';
import type { PartialLineage } from '../../../../shared/types';
import {
  dragonSchema,
  validateGenerationCount,
} from '../../../../shared/validation';
import { Lineage } from '../lineageHandler';
import { DragonBuilder } from '../dragonBuilder';
import { dragonGen13, dragonGen2 } from './testData';

describe('lineage validations', () => {
  it('fails if 13 generations or more', async () => {
    const generationCount = Lineage(
      dragonGen13 as PartialLineage,
    ).generations();

    expect(generationCount).to.be.eq(13);
    expect(validateGenerationCount(generationCount)).to.be.false;
  });

  it('fails if 1 generations or more', async () => {
    const generationCount = Lineage().generations();

    expect(generationCount).to.be.eq(1);
    expect(validateGenerationCount(generationCount)).to.be.false;
  });

  it('passes if good', async () => {
    const generationCount = Lineage(dragonGen2 as PartialLineage).generations();

    expect(generationCount).to.be.eq(2);
    expect(validateGenerationCount(generationCount)).to.be.true;
  });
});

describe('dragon validations', () => {
  it('passes', async () => {
    const dragon = await dragonSchema.isValid(DragonBuilder.create());
    expect(dragon).to.be.true;
  });

  it('fails if a key is missing', async () => {
    const dragon = await dragonSchema.isValid({});
    expect(dragon).to.be.false;
  });

  describe('name', () => {
    it('fails if empty', async () => {
      const dragon = await dragonSchema.isValid(
        DragonBuilder.create({ name: '' }),
      );

      expect(dragon).to.be.false;
    });

    it('fails if 33 characters or more in length', async () => {
      const dragon = await dragonSchema.isValid(
        DragonBuilder.create({ name: 'a'.repeat(33) }),
      );

      expect(dragon).to.be.false;
    });

    it('fails if first character not alphanumeric', async () => {
      const dragon = await dragonSchema.isValid(
        DragonBuilder.create({ name: "'abc" }),
      );

      expect(dragon).to.be.false;
    });

    it('fails if last character not alphanumeric', async () => {
      const dragon = await dragonSchema.isValid(
        DragonBuilder.create({ name: "abc'" }),
      );

      expect(dragon).to.be.false;
    });

    it('fails if first character is space', async () => {
      const dragon = await dragonSchema.isValid(
        DragonBuilder.create({ name: ' abc' }),
      );

      expect(dragon).to.be.false;
    });

    it('fails if last character is space', async () => {
      const dragon = await dragonSchema.isValid(
        DragonBuilder.create({ name: 'abc ' }),
      );

      expect(dragon).to.be.false;
    });

    it('passes good names', async () => {
      const dragon = await dragonSchema.isValid(
        DragonBuilder.create({
          name: 'The Quick Brown 1 Fox Jumped 228',
        }),
      );

      expect(dragon).to.be.true;
    });
  });

  describe('code', () => {
    it('fails if not alphanumeric', async () => {
      const dragon = await dragonSchema.isValid(
        DragonBuilder.create({ code: "'abc*" }),
      );

      expect(dragon).to.be.false;
    });

    it('fails if not at least 4 characters', async () => {
      const dragon = await dragonSchema.isValid(
        DragonBuilder.create({ code: 'abc' }),
      );

      expect(dragon).to.be.false;
    });

    it('fails if 6 characters or more', async () => {
      const dragon = await dragonSchema.isValid(
        DragonBuilder.create({ code: 'abc5T1' }),
      );

      expect(dragon).to.be.false;
    });

    it('passes good 4 length codes', async () => {
      const dragon = await dragonSchema.isValid(
        DragonBuilder.create({ code: 'COCk' }),
      );

      expect(dragon).to.be.true;
    });

    it('passes good 5 length codes', async () => {
      const dragon = await dragonSchema.isValid(
        DragonBuilder.create({ code: '0COCk' }),
      );

      expect(dragon).to.be.true;
    });
  });

  describe('display', () => {
    it('fails if not 0 or 1', async () => {
      const dragon = await dragonSchema.isValid(
        DragonBuilder.create({
          /* @ts-ignore */
          display: -1,
        }),
      );

      expect(dragon).to.be.false;
    });

    it('fails if not 0 or 1', async () => {
      const dragon = await dragonSchema.isValid(
        DragonBuilder.create({
          /* @ts-ignore */
          display: 2,
        }),
      );

      expect(dragon).to.be.false;
    });

    it('passes 0', async () => {
      const dragon = await dragonSchema.isValid(
        DragonBuilder.create({ display: 0 }),
      );

      expect(dragon).to.be.true;
    });

    it('passes 1', async () => {
      const dragon = await dragonSchema.isValid(
        DragonBuilder.create({ display: 1 }),
      );

      expect(dragon).to.be.true;
    });
  });

  describe('breed', () => {
    it('fails if not alphanumeric/space', async () => {
      const dragon = await dragonSchema.isValid(
        DragonBuilder.create({ breed: 'Ab#C,12 kx&sys' }),
      );

      expect(dragon).to.be.false;
    });

    it('fails if not at least 1 character', async () => {
      const dragon = await dragonSchema.isValid(
        DragonBuilder.create({ breed: '' }),
      );

      expect(dragon).to.be.false;
    });

    it('fails if 33 characters or more', async () => {
      const dragon = await dragonSchema.isValid(
        DragonBuilder.create({ code: 'b'.repeat(33) }),
      );

      expect(dragon).to.be.false;
    });

    it('fails if breed name unrecognised', async () => {
      const dragon = await dragonSchema.isValid(
        DragonBuilder.create({ breed: 'Ab C 12 kx xys' }),
      );

      expect(dragon).to.be.false;
    });
  });

  describe('gender', () => {
    it("fails if not 'm' or 'f'", async () => {
      const dragon = await dragonSchema.isValid(
        DragonBuilder.create({
          /* @ts-ignore */
          gender: 'x',
        }),
      );

      expect(dragon).to.be.false;
    });

    it("passes 'm'", async () => {
      const dragon = await dragonSchema.isValid(
        DragonBuilder.create({ gender: 'm' }),
      );

      expect(dragon).to.be.true;
    });

    it("passes 'f'", async () => {
      const dragon = await dragonSchema.isValid(
        DragonBuilder.create({ gender: 'f' }),
      );

      expect(dragon).to.be.true;
    });
  });

  describe('parents', () => {
    it('passes empty object', async () => {
      const dragon = await dragonSchema.isValid(
        DragonBuilder.create({ parents: {} }),
      );

      expect(dragon).to.be.true;
    });

    it("passes if 'm' and 'f' keys are dragons", async () => {
      const dragon = await dragonSchema.isValid(
        DragonBuilder.create({
          parents: {
            m: DragonBuilder.create(),
            f: DragonBuilder.create(),
          },
        }),
      );

      expect(dragon).to.be.true;
    });
  });
});
