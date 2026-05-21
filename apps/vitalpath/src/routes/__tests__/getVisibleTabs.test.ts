import { TAB_ROUTES } from '../routes';
import { getVisibleTabs } from '../getVisibleTabs';
import type { Role } from '@repo/types';

describe('getVisibleTabs', () => {
  it('paciente sees all 4 tabs', () => {
    const visible = getVisibleTabs('paciente');
    expect(visible).toHaveLength(4);
    const names = visible.map(r => r.screenName);
    expect(names).toContain('records');
    expect(names).toContain('home/index');
    expect(names).toContain('chat/index');
    expect(names).toContain('appointments/index');
  });

  it('cuidador_familiar sees Chat and Citas tabs', () => {
    const visible = getVisibleTabs('cuidador_familiar');
    expect(visible).toHaveLength(2);
    const names = visible.map(r => r.screenName);
    expect(names).toContain('chat/index');
    expect(names).toContain('appointments/index');
  });

  it('admin sees no tabs', () => {
    const visible = getVisibleTabs('admin');
    expect(visible).toHaveLength(0);
  });

  it('trabajador_centro sees no tabs', () => {
    const visible = getVisibleTabs('trabajador_centro');
    expect(visible).toHaveLength(0);
  });

  it('null role sees no tabs (least privilege)', () => {
    const visible = getVisibleTabs(null);
    expect(visible).toHaveLength(0);
  });

  it('returns a subset of TAB_ROUTES (not copies)', () => {
    const visible = getVisibleTabs('paciente');
    visible.forEach(r => {
      expect(TAB_ROUTES).toContain(r);
    });
  });
});
