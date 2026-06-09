import * as fs from 'fs';
import * as path from 'path';

const componentPath = path.resolve(__dirname, '../DailyCheckIn.tsx');

describe('DailyCheckIn — Reanimated migration (PERF-B3-T03)', () => {
  let source: string;

  beforeAll(() => {
    source = fs.readFileSync(componentPath, 'utf-8');
  });

  it('does NOT use new Animated.Value from react-native', () => {
    expect(source).not.toMatch(/new Animated\.Value/);
  });

  it('does NOT use Animated.sequence from react-native', () => {
    expect(source).not.toMatch(/Animated\.sequence/);
  });

  it('does NOT use Animated.delay from react-native', () => {
    expect(source).not.toMatch(/Animated\.delay/);
  });

  it('uses withSequence from react-native-reanimated', () => {
    expect(source).toMatch(/withSequence/);
    expect(source).toMatch(/from\s+['"]react-native-reanimated['"]/);
  });

  it('uses withDelay from react-native-reanimated', () => {
    expect(source).toMatch(/withDelay/);
  });
});
