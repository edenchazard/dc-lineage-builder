import type {
  PartialLineage,
  PartialLineageWithMetadata,
  MaybePartialLineageWithMetadata,
  DragonGender,
} from './types';
import {
  createLineageLink,
  deepClone,
  getBreedData,
  hasParents,
} from '../app/utils';
import { DragonBuilder } from './dragonBuilder';
import { dragonSchema, validateGenerationCount } from './validation';
import settings from '../app/settings';
import { saveLineage } from '../app/api';
import { placeholder } from './breeds';

/**
 * Returns a handler tries to json parse the passed treeref
 */
/* function Lineage(treeRef: string, addMissingMetadata: boolean): LineageHandler; */

/**
 * Returns a handler with a newly generated starter node
 */
function Lineage(): LineageHandler;

function Lineage<T extends MaybePartialLineageWithMetadata = PartialLineage>(
  treeRef: T,
): LineageHandler;

/**
 * Simple helper function to avoid calling new LineageHandler() a lot
 * @param tree
 * @param addMissingMetadata
 */
function Lineage<T extends MaybePartialLineageWithMetadata = PartialLineage>(
  treeRef?: T,
): LineageHandler {
  if (typeof treeRef === 'undefined')
    return new LineageHandler(DragonBuilder.create());

  return new LineageHandler<T>(treeRef);
}

class LineageHandler<
  T extends MaybePartialLineageWithMetadata = PartialLineage,
> {
  public tree: T;

  constructor(treeRef: T) {
    this.tree = treeRef;
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
  every(callback: (Dragon: T) => void): T {
    // for performance reasons, we create a completely new clone,
    // mutate and return it. Trees with vue reactive proxies
    // have a massive performance cost because we touch so many properties.
    const raw = this.raw();

    const analyse = (dragon: T) => {
      callback(dragon);

      if (hasParents(dragon)) {
        analyse(dragon.parents.f as T);
        analyse(dragon.parents.m as T);
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
    breeds.delete(placeholder.name);

    return breeds;
  }

  /**
   * Get raw lineage as a JSON object without getters or setters.
   */
  raw(): T {
    return deepClone<T>(this.tree);
  }

  /**
   * Get the lineage with metadata excluded e.g. selected
   */
  withoutMetadata(): LineageHandler {
    const get = function (
      dragon: MaybePartialLineageWithMetadata,
    ): PartialLineage {
      const { code, name, breed, gender, display } = dragon;

      return {
        code,
        name,
        breed,
        gender,
        display,
        parents: hasParents(dragon)
          ? {
              f: get(dragon.parents.f),
              m: get(dragon.parents.m),
            }
          : {},
      };
    };

    return new LineageHandler<PartialLineage>(get(this.tree));
  }

  withMetadata(): LineageHandler<PartialLineageWithMetadata> {
    return new LineageHandler<PartialLineageWithMetadata>(
      this.every(
        (dragon) => (dragon.selected = false),
      ) as PartialLineageWithMetadata,
    );
  }

  /**
   * Scan the lineage and count the number of generations.
   */
  generations(): number {
    // find the furthest gen back by scanning the tree
    let max = 1;

    const scan = (dragon: MaybePartialLineageWithMetadata, x: number) => {
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

  getAtPath(path: string): LineageHandler | undefined {
    if (path === '') return this;

    const p = path.split('.').filter((v) => v !== 'parents');

    let node = this.tree;

    for (let i = 0; i < p.length; ++i) {
      const parentGender = p[i] as DragonGender;

      if (!['m', 'f'].includes(parentGender)) {
        throw new Error(`bad gender: ${parentGender}`);
      }

      if (parentGender in node.parents) {
        node = node.parents[parentGender] as T;
      } else {
        return undefined;
      }
    }

    return new LineageHandler<T>(node);
  }

  async saveToServer(): Promise<string> {
    const gens = this.generations();

    const legit = await dragonSchema
      .test(
        'generation-count',
        ({
          value,
        }) => `This lineage is ${gens}. To save on the server, lineages must
        be between ${settings.gens.min} and ${settings.gens.max}
        generations long inclusively.`,
        () => validateGenerationCount(gens),
      )
      .validate(this.withoutMetadata().raw());

    const response = await saveLineage(legit);

    return createLineageLink(response.data.hash);
  }

  // Takes a parents object and switches the two
  // If null, returns null
  switchParents(): LineageHandler<T> {
    // check it has parents
    if (!hasParents(this.tree)) return this;

    const switched = (dragon: T): T => {
      const newGender = dragon.gender === 'f' ? 'm' : 'f';

      const breed = getBreedData(dragon.breed);

      // todo
      if (breed!.genderOnly) dragon.breed = placeholder.name;

      Object.assign(dragon.gender, newGender);
      return dragon;
    };

    // perf op
    const copy = this.raw();

    // make a new branch with the parents switched
    return new LineageHandler<T>({
      ...copy,
      parents: {
        m: switched(copy.parents.f as T),
        f: switched(copy.parents.m as T),
      },
    });
  }
}

export { Lineage, LineageHandler };
