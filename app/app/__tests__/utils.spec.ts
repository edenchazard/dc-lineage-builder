import { describe, it, expect } from 'vitest';
import { createLineageLink } from '../utils';

describe('utils', () => {
  describe('#createLineageLink', () => {
    it('returns a link to the view lineage with a given hash', () => {
      const originalWindowLocation = window.location;

      Object.defineProperty(window, 'location', {
        configurable: true,
        enumerable: true,
        value: new URL('http://example.com/'),
      });

      expect(createLineageLink('test')).to.be.equal(
        'http://example.com/view/test',
      );

      Object.defineProperty(window, 'location', {
        configurable: true,
        enumerable: true,
        value: originalWindowLocation,
      });
    });
  });
});
