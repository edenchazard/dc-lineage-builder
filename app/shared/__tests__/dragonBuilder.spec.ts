import { describe, it, expect } from 'vitest';
import { DragonBuilder } from '../dragonBuilder';

describe('dragonBuilder', () => {
  describe('.create()', () => {
    it('returns a new lineage with defaults and no metadata', async () => {
      const instance = DragonBuilder.create();

      expect(instance).to.have.all.keys([
        'code',
        'name',
        'parents',
        'display',
        'breed',
        'gender',
      ]);
      expect(instance).to.not.have.property('selected');
    });
  });

  describe('.createWithMetadata()', () => {
    it('returns a new lineage with defaults and metadata', async () => {
      const instance = DragonBuilder.createWithMetadata();

      expect(instance).to.have.all.keys([
        'code',
        'name',
        'parents',
        'display',
        'breed',
        'gender',
        'selected',
      ]);
      expect(instance.selected).to.be.false;
    });
  });
});
