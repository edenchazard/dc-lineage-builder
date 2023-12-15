import { describe, it, expect } from 'vitest';
import { DragonBuilder } from '../dragonBuilder';

describe('dragon builder', () => {
  describe('#create', () => {
    it('returns a new lineage with defaults and no metadata', async () => {
      const instance = DragonBuilder.create();

      expect(instance).to.have.property('code');
      expect(instance).to.have.property('name');
      expect(instance).to.have.property('parents');
      expect(instance).to.have.property('breed');
      expect(instance).to.have.property('gender');
      expect(instance).to.not.have.property('selected');
    });
  });

  describe('#createWithMetadata', () => {
    it('returns a new lineage with defaults and metadata', async () => {
      const instance = DragonBuilder.createWithMetadata();

      expect(instance).to.have.property('code');
      expect(instance).to.have.property('name');
      expect(instance).to.have.property('parents');
      expect(instance).to.have.property('breed');
      expect(instance).to.have.property('gender');
      expect(instance).to.have.property('selected');
      expect(instance).property('selected').to.be.false;
    });
  });

  describe('#switchParents', () => {
    it('returns new lineage handler instance', async () => {
      const instance = DragonBuilder.createWithMetadata();
    });
  });
});
