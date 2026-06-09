import * as fs from 'fs';
import * as path from 'path';

const pkgPath = path.resolve(__dirname, '../package.json');

describe('package.json — @ui-kitten removal (PERF-B4-T01)', () => {
  let pkg: {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
  };

  beforeAll(() => {
    pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
  });

  it('@ui-kitten/components is absent from dependencies', () => {
    expect(pkg.dependencies?.['@ui-kitten/components']).toBeUndefined();
  });

  it('@ui-kitten/components is absent from devDependencies', () => {
    expect(pkg.devDependencies?.['@ui-kitten/components']).toBeUndefined();
  });
});
