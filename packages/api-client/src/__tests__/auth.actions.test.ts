import { describe, it, expect, vi, beforeEach } from 'vitest';
import { postRegister, postRegisterCuidador } from '../actions/auth.actions';
import type {
  RegisterCredentials,
  RegisterCuidadorCredentials,
} from '@repo/types';

// Mock apiClient at the module level so no real HTTP calls are made
vi.mock('../client', () => ({
  apiClient: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

import { apiClient } from '../client';

const mockPost = vi.mocked(apiClient.post);

const MOCK_USER_CREDENTIALS = {
  accessToken: 'tok-abc',
  user: { _id: 'u1', role: 'Paciente' },
};

beforeEach(() => {
  vi.clearAllMocks();
  mockPost.mockResolvedValue({ data: MOCK_USER_CREDENTIALS });
});

// ─────────────────────────────────────────────────────────────
// postRegister — date conversion
// ─────────────────────────────────────────────────────────────

describe('postRegister', () => {
  describe('fechaNacimiento date conversion', () => {
    it('sends fechaNacimiento as YYYY-MM-DD when given DD/MM/YYYY input', async () => {
      const credentials = {
        name: 'Ana',
        lastName: 'Lopez',
        email: 'ana@example.com',
        password: 'secret123',
        fechaNacimiento: '15/03/1990',
        genero: 'Femenino',
      } as unknown as RegisterCredentials;

      await postRegister(credentials);

      expect(mockPost).toHaveBeenCalledOnce();
      const [, payload] = mockPost.mock.calls[0];
      expect((payload as any).fechaNacimiento).toBe('1990-03-15');
    });

    it('sends fechaNacimiento as YYYY-MM-DD when given a different DD/MM/YYYY input (triangulation)', async () => {
      const credentials = {
        name: 'Carlos',
        lastName: 'Gomez',
        email: 'carlos@example.com',
        password: 'pass456',
        fechaNacimiento: '01/07/2000',
        genero: 'Masculino',
      } as unknown as RegisterCredentials;

      await postRegister(credentials);

      const [, payload] = mockPost.mock.calls[0];
      expect((payload as any).fechaNacimiento).toBe('2000-07-01');
    });

    it('does NOT alter other fields', async () => {
      const credentials = {
        name: 'Maria',
        lastName: 'Ruiz',
        email: 'maria@example.com',
        password: 'pwd789',
        fechaNacimiento: '20/11/1985',
        genero: 'Femenino',
      } as unknown as RegisterCredentials;

      await postRegister(credentials);

      const [, payload] = mockPost.mock.calls[0];
      expect((payload as any).name).toBe('Maria');
      expect((payload as any).lastName).toBe('Ruiz');
      expect((payload as any).email).toBe('maria@example.com');
      expect((payload as any).password).toBe('pwd789');
      expect((payload as any).genero).toBe('Femenino');
    });
  });
});

// ─────────────────────────────────────────────────────────────
// postRegisterCuidador — date conversion
// ─────────────────────────────────────────────────────────────

describe('postRegisterCuidador', () => {
  describe('fechaNacimiento date conversion', () => {
    it('sends fechaNacimiento as YYYY-MM-DD when given DD/MM/YYYY input', async () => {
      const credentials = {
        name: 'Luis',
        lastName: 'Torres',
        email: 'luis@example.com',
        password: 'passabc',
        fechaNacimiento: '25/08/1975',
        genero: 'Masculino',
        pacienteId: 'p-123',
      } as unknown as RegisterCuidadorCredentials;

      await postRegisterCuidador(credentials);

      expect(mockPost).toHaveBeenCalledOnce();
      const [, payload] = mockPost.mock.calls[0];
      expect((payload as any).fechaNacimiento).toBe('1975-08-25');
    });

    it('sends fechaNacimiento as YYYY-MM-DD when given a different DD/MM/YYYY input (triangulation)', async () => {
      const credentials = {
        name: 'Sofia',
        lastName: 'Perez',
        email: 'sofia@example.com',
        password: 'sofpass',
        fechaNacimiento: '30/12/1999',
        genero: 'Femenino',
        pacienteId: 'p-456',
      } as unknown as RegisterCuidadorCredentials;

      await postRegisterCuidador(credentials);

      const [, payload] = mockPost.mock.calls[0];
      expect((payload as any).fechaNacimiento).toBe('1999-12-30');
    });

    it('does NOT alter other fields', async () => {
      const credentials = {
        name: 'Pedro',
        lastName: 'Sanchez',
        email: 'pedro@example.com',
        password: 'pedpwd',
        fechaNacimiento: '10/05/1980',
        genero: 'Masculino',
        pacienteId: 'p-789',
      } as unknown as RegisterCuidadorCredentials;

      await postRegisterCuidador(credentials);

      const [, payload] = mockPost.mock.calls[0];
      expect((payload as any).name).toBe('Pedro');
      expect((payload as any).email).toBe('pedro@example.com');
      expect((payload as any).genero).toBe('Masculino');
    });
  });
});
