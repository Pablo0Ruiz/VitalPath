const babelConfig = require('../babel.config.js');

describe('babel.config.js — React Compiler plugin order (PERF-B0-T03)', () => {
  let config: {
    presets: string[];
    plugins: Array<string | [string, Record<string, unknown>]>;
  };

  beforeAll(() => {
    const api = { cache: jest.fn() };
    config = babelConfig(api);
  });

  it('has react-native-worklets/plugin as the last plugin', () => {
    const { plugins } = config;
    expect(plugins.length).toBeGreaterThanOrEqual(2);
    const lastPlugin = plugins[plugins.length - 1];
    const lastName = Array.isArray(lastPlugin) ? lastPlugin[0] : lastPlugin;
    expect(lastName).toBe('react-native-worklets/plugin');
  });

  it('has babel-plugin-react-compiler as the first plugin', () => {
    const { plugins } = config;
    const firstPlugin = plugins[0];
    const firstName = Array.isArray(firstPlugin) ? firstPlugin[0] : firstPlugin;
    expect(firstName).toBe('babel-plugin-react-compiler');
  });

  it('has compilationMode set to "annotation"', () => {
    const { plugins } = config;
    const firstPlugin = plugins[0];
    expect(Array.isArray(firstPlugin)).toBe(true);
    const options = (firstPlugin as [string, Record<string, unknown>])[1];
    expect(options.compilationMode).toBe('annotation');
  });
});
