import { ArgumentsType } from '@vueuse/core';
import { DragonType } from './types';

class MiniTester {
  suppressReasoning: boolean;
  failed: boolean | null = null;
  failHandler: ((testName: string, ...args: unknown[]) => void) | null = null;
  running: boolean = false;

  constructor(suppressReasoning = false) {
    this.suppressReasoning = suppressReasoning;
  }

  setFailHandler(func: (testName: string, ...args: unknown[]) => void) {
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

  testFail(testName: string, ...args: unknown[]) {
    this.failed = true;
    if (!this.suppressReasoning && this.failHandler)
      this.failHandler(testName, ...args);
  }

  runTest(
    func: (...args: unknown[]) => boolean,
    ...args: ArgumentsType<typeof func>
  ) {
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

function createTester(
  suppressReasoning = false,
): [MiniTester, string[], context] {
  const tester = new MiniTester(suppressReasoning);
  const failedTests: string[] = [];
  const context: context = {
    failedDragon: null,
  };

  // fails the integrity check and gives reasoning
  tester.setFailHandler((testName, value) => {
    console.warn(`Test '${testName}' failed`, value);

    // this is a bit hackish, but we only want to provide
    // a failed dragon context when we're... actually testing dragons
    if (typeof value === 'object' && 'code' in (value as DragonType)) {
      context.failedDragon = value as DragonType;
    }
    failedTests.push(testName);
  });

  return [tester, failedTests, context];
}

export { MiniTester, createTester };
