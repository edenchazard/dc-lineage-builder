import GLOBALS from './globals';
import type {
  PartialLineage,
  PartialLineageWithMetadata,
  MaybePartialLineageWithMetadata,
  DragonTypeWithMetadata,
} from './types';
import { deepClone, hasParents } from './utils';
import { DragonBuilder } from './dragonBuilder';

/**
 * Returns a handler tries to json parse the passed treeref
 */
function Lineage(treeRef: string, addMissingMetadata: boolean): LineageHandler;

/**
 * Returns a handler with a newly generated starter node
 */
function Lineage(): LineageHandler;

function Lineage(
  treeRef: MaybePartialLineageWithMetadata,
  addMissingMetadata?: boolean,
): LineageHandler;

/**
 * Simple helper function to avoid calling new LineageHandler() a lot
 * @param tree
 * @param addMissingMetadata
 */
function Lineage(
  treeRef?: MaybePartialLineageWithMetadata | string,
  addMissingMetadata = false,
): LineageHandler {
  if (typeof treeRef === 'undefined')
    return new LineageHandler(DragonBuilder.create(), false);
  else if (typeof treeRef === 'string')
    return new LineageHandler(JSON.parse(treeRef.trim()), addMissingMetadata);

  return new LineageHandler(
    // hacky...
    treeRef as PartialLineageWithMetadata,
    addMissingMetadata,
  );
}

class LineageHandler {
  public tree: PartialLineageWithMetadata;

  constructor(
    treeRef: MaybePartialLineageWithMetadata,
    addMissingMetadata = false,
  ) {
    this.tree = treeRef as PartialLineageWithMetadata;
    if (addMissingMetadata) this.every((dragon) => (dragon.selected = false));
  }

  /**
   * Count number of dragons in the lineage.
   */
  count(
    where: keyof PartialLineageWithMetadata,
    value: PartialLineageWithMetadata[typeof where],
  ): number {
    let count = 0;

    this.every((dragon) => {
      if (typeof where === 'string') {
        if (dragon[where] === value) {
          count++;
          return;
        }
      }
      count++;
    });
    return count;
  }

  /**
   * Recursively iterate through each dragon in the lineage.
   * @param callback Callback to execute on each dragon.
   */
  every(
    callback: (Dragon: DragonTypeWithMetadata) => void,
  ): PartialLineageWithMetadata {
    // for performance reasons, we create a completely new clone,
    // mutate and return it. Trees with vue reactive proxies
    // have a massive performance cost because we touch so many properties.
    const raw = this.raw();

    const analyse = (dragon: DragonTypeWithMetadata) => {
      callback(dragon);
      if (hasParents(dragon)) {
        analyse(dragon.parents.f);
        analyse(dragon.parents.m);
      }
    };

    analyse(raw);
    return raw;
  }

  /**
   * Get list of breeds and counts
   */
  breeds(): Map<string, number> {
    const breeds = new Map<string, number>();

    this.every((dragon) =>
      breeds.set(dragon.breed, (breeds.get(dragon.breed) ?? 0) + 1),
    );

    // exclude placeholder
    breeds.delete(GLOBALS.placeholder.name);
    return breeds;
  }

  /**
   * Get raw lineage without getters or setters.
   */
  raw(): PartialLineageWithMetadata {
    return deepClone(this.tree);
  }

  /**
   * Get the lineage with metadata excluded e.g. selected
   */
  withoutMetadata(): PartialLineage {
    const get = function (dragon: DragonTypeWithMetadata) {
      const { code, name, breed, gender, display } = dragon;

      let parents = {};

      if (hasParents(dragon)) {
        parents = {
          f: get(dragon.parents.f),
          m: get(dragon.parents.m),
        };
      }

      return { code, name, parents, breed, gender, display };
    };

    return get(this.tree);
  }

  /**
   * Scan the lineage and count the number of generations.
   */
  generations(): number {
    // find the furthest gen back by scanning the tree
    let max = 1;

    const scan = (dragon: DragonTypeWithMetadata, x: number) => {
      if (hasParents(dragon)) {
        scan(dragon.parents.m, x + 1);
        scan(dragon.parents.f, x + 1);
      }
      // end of branch
      else if (x > max) max = x;
    };
    scan(this.tree, 1);
    return max;
  }
}

export { Lineage };
