import * as fs from 'fs';
import * as path from 'path';

const FONTS_IN_USE_FONTS: string[] = [
  'Inter_18pt-Light.ttf',
  'Inter_18pt-Regular.ttf',
  'PlusJakartaSans-VariableFont_wght.ttf',
];

const fontsDir = path.resolve(__dirname, '../assets/fonts');

describe('Font audit — PERF-B4-T03', () => {
  let actualFontFiles: string[];

  beforeAll(() => {
    actualFontFiles = fs
      .readdirSync(fontsDir)
      .filter(f => f.endsWith('.ttf') || f.endsWith('.otf'));
  });

  it('every file in assets/fonts/ is referenced in useFonts()', () => {
    const orphans = actualFontFiles.filter(
      f => !FONTS_IN_USE_FONTS.includes(f),
    );
    expect(orphans).toEqual([]);
  });

  it('every font in useFonts() has a corresponding file in assets/fonts/', () => {
    const missing = FONTS_IN_USE_FONTS.filter(
      f => !actualFontFiles.includes(f),
    );
    expect(missing).toEqual([]);
  });
});
