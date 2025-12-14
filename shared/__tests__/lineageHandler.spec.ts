import { describe, it, expect } from 'vitest';
import type { PartialLineage } from '../types';
import { Lineage, LineageHandler } from '../lineageHandler';
import { dragonGen3, dragonGen3Swapped } from '../../__tests__/testData';
import { injectBreedList } from '../breeds.js';

await injectBreedList();

describe('lineageHandler', () => {
  describe('#getAtPath()', () => {
    it('returns new lineage handler instance', () => {
      const theLineage = Lineage(dragonGen3 as PartialLineage);
      const subTree = theLineage.getAtPath('m.m');

      expect(subTree).to.be.instanceOf(LineageHandler);
    });

    it('returns the root dragon when empty path', () => {
      const theLineage = Lineage(dragonGen3 as PartialLineage);
      const subTree = theLineage.getAtPath('');

      expect(subTree?.raw()).to.be.eql(dragonGen3);
    });

    it('returns the dragon at a specified path', () => {
      const theLineage = Lineage(dragonGen3 as PartialLineage);
      const subTree = theLineage.getAtPath('m.m');

      expect(subTree?.raw()).to.be.eql({
        code: 'WuTUL',
        name: 'Red Blue',
        parents: {},
        breed: 'Placeholder',
        gender: 'm',
        display: 1,
      });
    });

    it('returns undefined when specified path not exists', () => {
      const theLineage = Lineage(dragonGen3 as PartialLineage);
      const subTree = theLineage.getAtPath('m.m.f.f');

      expect(subTree?.raw()).to.be.eq(undefined);
    });
  });

  describe('#switchParents()', () => {
    it('swaps the parents and uses placeholders if necessary', () => {
      const theLineage = Lineage(dragonGen3 as PartialLineage);
      expect(theLineage.switchParents().raw()).to.be.eql(dragonGen3Swapped);
    });
  });
});
