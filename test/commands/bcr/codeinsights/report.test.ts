import { expect, test } from '@oclif/test';

describe('bcr codeinsights report', () => {
  test
    .stdout()
    .command(['bcr codeinsights report'])
    .it('runs hello', (ctx) => {
      expect(ctx.stdout).to.contain('hello world');
    });

  test
    .stdout()
    .command(['bcr codeinsights report', '--name', 'Astro'])
    .it('runs hello --name Astro', (ctx) => {
      expect(ctx.stdout).to.contain('hello Astro');
    });
});
