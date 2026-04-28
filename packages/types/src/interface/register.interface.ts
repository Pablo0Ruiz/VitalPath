export interface RegisterDraft {
  name: string;
  lastName: string;
  fechaNacimiento: string;
  genero: 'Masculino' | 'Femenino' | 'Otro';
  email: string;
  password: string;
}
