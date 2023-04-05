import { DragonType } from './types';
import { hasParents } from './utils';

class MiniTester {
  supressReasoning: boolean;
  failed: boolean | null = null;
  failHandler: Function | null = null;
  running: boolean = false;

  constructor(supressReasoning = false) {
    this.supressReasoning = supressReasoning;
  }

  setFailHandler(func: (testName: string, ...args: any) => void) {
    this.failHandler = func;
  }

  begin() {
    this.failed = false;
    this.running = true;
  }

  stop() {
    this.running = false;
  }

  reset() {
    this.failed = null;
  }

  testFail(testName: string, ...args: any) {
    this.failed = true;
    if (!this.supressReasoning && this.failHandler)
      this.failHandler(testName, ...args);
  }

  runTest(func: (...args: any) => boolean, ...args: any) {
    // ignore test if tester isn't running
    if (!this.running) return;

    const result = func(...args);
    if (!result) this.testFail(func.name, ...args);
    return result;
  }
}

interface context {
  failedDragon: null | DragonType;
}
//failureCallback: (test: string) => void
function createTester(
  supressReasoning = false,
): [MiniTester, string[], context] {
  const tester = new MiniTester(supressReasoning);
  const failedTests: string[] = [];
  const context: context = {
    failedDragon: null,
  };

  // fails the integrity check and gives reasoning
  tester.setFailHandler((testName, value: any) => {
    console.warn(`Test '${testName}' failed`, value);

    // this is a bit hackish, but we only want to provide
    // a failed dragon context when we're... actually testing dragons
    if (typeof value === 'object' && 'code' in value) {
      context.failedDragon = value;
    }
    failedTests.push(testName);
  });

  return [tester, failedTests, context];
}

export { MiniTester, createTester };
