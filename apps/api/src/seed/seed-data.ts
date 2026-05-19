import { Especialidad } from 'src/auth/enum/especialidad.enum';
import { UserGenero } from 'src/auth/enum/user-genero.enum';
import { UserRoles } from 'src/auth/enum/user-role.enum';
import { HospitalType } from 'src/user/entities/centro-salud.entity';

/**
 * Contraseña universal usada para todos los usuarios seed.
 * En producción este endpoint no está disponible.
 */
export const SEED_PASSWORD = 'Password123!';

// ─── Centros de Salud ─────────────────────────────────────────────────────────

export const centrosSaludSeed = [
  {
    nombre: 'Hospital General del Norte',
    direccion: 'Av. del Norte 1234, Madrid',
    tipo: HospitalType.GENERAL,
    codigoVinculacion: 'NORD-2024',
    listaMedicos_ID: [],
    listaTrabajadores_ID: [],
  },
  {
    nombre: 'Clínica Santa Rosa',
    direccion: 'Calle Santa Rosa 567, Barcelona',
    tipo: HospitalType.CLINICA,
    codigoVinculacion: 'ROSA-2024',
    listaMedicos_ID: [],
    listaTrabajadores_ID: [],
  },
];

// ─── Administrador ────────────────────────────────────────────────────────────

export const adminSeed = {
  name: 'admin',
  lastName: 'vitalpath',
  email: 'admin@test.com',
  role: UserRoles.ADMIN,
  fechaNacimiento: new Date('1985-01-01'),
  genero: UserGenero.MASCULINO,
  telefono: '+34 600 000 000',
  isActive: true,
};

// ─── Cuidador Familiar ────────────────────────────────────────────────────────

export const caregiverSeed = {
  name: 'juan',
  lastName: 'pérez',
  email: 'cuidador@test.com',
  role: UserRoles.CUIDADOR_FAMILIAR,
  fechaNacimiento: new Date('1985-05-15'),
  genero: UserGenero.MASCULINO,
  telefono: '+34 600 111 222',
  isActive: true,
};

// ─── Pacientes sin código de acceso ──────────────────────────────────────────
// Pueden hacer login solo con email + contraseña

export const pacientesSinCodigoSeed = [
  {
    name: 'carlos',
    lastName: 'martínez',
    email: 'carlos.martinez@test.com',
    role: UserRoles.PACIENTE,
    fechaNacimiento: new Date('1990-03-15'),
    genero: UserGenero.MASCULINO,
    telefono: '+34 612 345 001',
    isActive: true,
    seniorMode: false,
  },
  {
    name: 'laura',
    lastName: 'sánchez',
    email: 'laura.sanchez@test.com',
    role: UserRoles.PACIENTE,
    fechaNacimiento: new Date('1995-07-22'),
    genero: UserGenero.FEMENINO,
    telefono: '+34 612 345 002',
    isActive: true,
    seniorMode: false,
  },
  {
    name: 'miguel',
    lastName: 'rodríguez',
    email: 'miguel.rodriguez@test.com',
    role: UserRoles.PACIENTE,
    fechaNacimiento: new Date('1988-11-08'),
    genero: UserGenero.MASCULINO,
    telefono: '+34 612 345 003',
    isActive: true,
    seniorMode: false,
  },
  {
    name: 'ana',
    lastName: 'garcía',
    email: 'ana.garcia@test.com',
    role: UserRoles.PACIENTE,
    fechaNacimiento: new Date('2000-01-30'),
    genero: UserGenero.FEMENINO,
    telefono: '+34 612 345 004',
    isActive: true,
    seniorMode: false,
  },
  {
    name: 'pedro',
    lastName: 'lópez',
    email: 'pedro.lopez@test.com',
    role: UserRoles.PACIENTE,
    fechaNacimiento: new Date('1985-09-14'),
    genero: UserGenero.MASCULINO,
    telefono: '+34 612 345 005',
    isActive: true,
    seniorMode: false,
  },
  {
    name: 'camila',
    lastName: 'flores',
    email: 'camila.flores@test.com',
    role: UserRoles.TRABAJADOR_CENTRO,
    fechaNacimiento: new Date('1991-04-30'),
    genero: UserGenero.FEMENINO,
    telefono: '+34 612 349 004',
    isActive: true,
    verificationCode: 'ROSA-2024',
  },
  {
    name: 'martín',
    lastName: 'espinoza',
    email: 'martin.espinoza@test.com',
    role: UserRoles.TRABAJADOR_CENTRO,
    fechaNacimiento: new Date('1977-12-23'),
    genero: UserGenero.MASCULINO,
    telefono: '+34 612 349 005',
    isActive: false, // Pending worker activation on web
    verificationCode: 'NORD-2024',
  },
];

// ─── Pacientes con código de acceso ──────────────────────────────────────────
// Tienen accessCode asignado (registrados por un trabajador del centro)

export const pacientesConCodigoSeed = [
  {
    name: 'sofía',
    lastName: 'hernández',
    email: 'sofia.hernandez@test.com',
    role: UserRoles.PACIENTE,
    fechaNacimiento: new Date('1992-04-10'),
    genero: UserGenero.FEMENINO,
    telefono: '+34 612 346 001',
    isActive: true,
    seniorMode: false,
    accessCode: 'PAC-001',
  },
  {
    name: 'diego',
    lastName: 'torres',
    email: 'diego.torres@test.com',
    role: UserRoles.PACIENTE,
    fechaNacimiento: new Date('1997-06-25'),
    genero: UserGenero.MASCULINO,
    telefono: '+34 612 346 002',
    isActive: true,
    seniorMode: false,
    accessCode: 'PAC-002',
  },
  {
    name: 'valentina',
    lastName: 'ruiz',
    email: 'valentina.ruiz@test.com',
    role: UserRoles.PACIENTE,
    fechaNacimiento: new Date('1993-12-03'),
    genero: UserGenero.FEMENINO,
    telefono: '+34 612 346 003',
    isActive: true,
    seniorMode: false,
    accessCode: 'PAC-003',
  },
  {
    name: 'andrés',
    lastName: 'moreno',
    email: 'andres.moreno@test.com',
    role: UserRoles.PACIENTE,
    fechaNacimiento: new Date('1989-08-17'),
    genero: UserGenero.MASCULINO,
    telefono: '+34 612 346 004',
    isActive: true,
    seniorMode: false,
    accessCode: 'PAC-004',
  },
  {
    name: 'isabella',
    lastName: 'castro',
    email: 'isabella.castro@test.com',
    role: UserRoles.PACIENTE,
    fechaNacimiento: new Date('2001-02-28'),
    genero: UserGenero.FEMENINO,
    telefono: '+34 612 346 005',
    isActive: true,
    seniorMode: false,
    accessCode: 'PAC-005',
  },
];

// ─── Personas mayores (65+) ───────────────────────────────────────────────────
// seniorMode: true, fechaNacimiento <= 1961, pueden usar loginWithCode

export const personasMayoresSeed = [
  {
    name: 'rosa',
    lastName: 'fernández',
    email: 'rosa.fernandez@test.com',
    role: UserRoles.PACIENTE,
    fechaNacimiento: new Date('1950-05-12'),
    genero: UserGenero.FEMENINO,
    telefono: '+34 612 347 001',
    isActive: true,
    seniorMode: true,
    accessCode: 'MAYO-001',
  },
  {
    name: 'manuel',
    lastName: 'gonzález',
    email: 'manuel.gonzalez@test.com',
    role: UserRoles.PACIENTE,
    fechaNacimiento: new Date('1952-09-30'),
    genero: UserGenero.MASCULINO,
    telefono: '+34 612 347 002',
    isActive: true,
    seniorMode: true,
    accessCode: 'MAYO-002',
  },
  {
    name: 'carmen',
    lastName: 'díaz',
    email: 'carmen.diaz@test.com',
    role: UserRoles.PACIENTE,
    fechaNacimiento: new Date('1955-01-18'),
    genero: UserGenero.FEMENINO,
    telefono: '+34 612 347 003',
    isActive: true,
    seniorMode: true,
    accessCode: 'MAYO-003',
  },
  {
    name: 'josé',
    lastName: 'pérez',
    email: 'jose.perez@test.com',
    role: UserRoles.PACIENTE,
    fechaNacimiento: new Date('1957-07-04'),
    genero: UserGenero.MASCULINO,
    telefono: '+34 612 347 004',
    isActive: true,
    seniorMode: true,
    accessCode: 'MAYO-004',
  },
  {
    name: 'maría',
    lastName: 'lópez',
    email: 'maria.lopez@test.com',
    role: UserRoles.PACIENTE,
    fechaNacimiento: new Date('1959-11-22'),
    genero: UserGenero.FEMENINO,
    telefono: '+34 612 347 005',
    isActive: true,
    seniorMode: true,
    accessCode: 'MAYO-005',
  },
];

// ─── Doctores verificados ─────────────────────────────────────────────────────
// isActive: true, sin verificationCode, vinculados a un centro
// centroIndex: 0 = Hospital del Norte, 1 = Clínica Santa Rosa

export const doctoresVerificadosSeed = [
  {
    name: 'roberto',
    lastName: 'gómez',
    email: 'roberto.gomez@test.com',
    role: UserRoles.MEDICO,
    fechaNacimiento: new Date('1975-04-20'),
    genero: UserGenero.MASCULINO,
    telefono: '+34 612 348 001',
    isActive: true,
    seniorMode: false,
    especialidad: Especialidad.CARDIOLOGIA,
    centroIndex: 0,
    slots: [
      '09:00',
      '10:00',
      '11:00',
      '12:00',
      '13:00',
      '14:00',
      '15:00',
      '16:00',
    ],
  },
  {
    name: 'elena',
    lastName: 'vargas',
    email: 'elena.vargas@test.com',
    role: UserRoles.MEDICO,
    fechaNacimiento: new Date('1980-08-15'),
    genero: UserGenero.FEMENINO,
    telefono: '+34 612 348 002',
    isActive: true,
    seniorMode: false,
    especialidad: Especialidad.MEDICINA_GENERAL,
    centroIndex: 1,
    slots: [
      '08:00',
      '08:30',
      '09:00',
      '09:30',
      '10:00',
      '10:30',
      '11:00',
      '11:30',
      '12:00',
      '12:30',
      '13:00',
    ],
  },
  {
    name: 'francisco',
    lastName: 'jiménez',
    email: 'francisco.jimenez@test.com',
    role: UserRoles.MEDICO,
    fechaNacimiento: new Date('1972-12-01'),
    genero: UserGenero.MASCULINO,
    telefono: '+34 612 348 003',
    isActive: true,
    seniorMode: false,
    especialidad: Especialidad.NEUROLOGIA,
    centroIndex: 0,
    slots: ['15:00', '16:00', '17:00'],
  },
  {
    name: 'patricia',
    lastName: 'reyes',
    email: 'patricia.reyes@test.com',
    role: UserRoles.MEDICO,
    fechaNacimiento: new Date('1983-03-28'),
    genero: UserGenero.FEMENINO,
    telefono: '+34 612 348 004',
    isActive: true,
    seniorMode: false,
    especialidad: Especialidad.NUTRICION,
    centroIndex: 1,
    slots: ['12:00', '13:00', '14:00'],
  },
  {
    name: 'alejandro',
    lastName: 'silva',
    email: 'alejandro.silva@test.com',
    role: UserRoles.MEDICO,
    fechaNacimiento: new Date('1978-06-11'),
    genero: UserGenero.MASCULINO,
    telefono: '+34 612 348 005',
    isActive: true,
    seniorMode: false,
    especialidad: Especialidad.TRAUMATOLOGIA,
    centroIndex: 0,
    slots: ['08:00', '09:00', '10:00'],
  },
];

// ─── Doctores pendientes de verificación ─────────────────────────────────────
// isActive: false, con verificationCode = codigoVinculacion del centro destino
// La web usa verificationCode para verificarlos y vincularlos al centro

export const doctoresPendientesSeed = [
  {
    name: 'sebastián',
    lastName: 'mora',
    email: 'sebastian.mora@test.com',
    role: UserRoles.MEDICO,
    fechaNacimiento: new Date('1982-02-14'),
    genero: UserGenero.MASCULINO,
    telefono: '+34 612 349 001',
    isActive: false, // Pending doctor verification on web
    seniorMode: false,
    especialidad: Especialidad.CARDIOLOGIA,
    verificationCode: 'NORD-2024',
    slots: ['09:00', '10:00', '11:00'],
  },
  {
    name: 'natalia',
    lastName: 'ortiz',
    email: 'natalia.ortiz@test.com',
    role: UserRoles.MEDICO,
    fechaNacimiento: new Date('1986-10-05'),
    genero: UserGenero.FEMENINO,
    telefono: '+34 612 349 002',
    isActive: false, // Pending doctor verification on web
    seniorMode: false,
    especialidad: Especialidad.MEDICINA_GENERAL,
    verificationCode: 'ROSA-2024',
    slots: ['08:00', '09:00', '10:00'],
  },
  {
    name: 'ramiro',
    lastName: 'ponce',
    email: 'ramiro.ponce@test.com',
    role: UserRoles.MEDICO,
    fechaNacimiento: new Date('1979-07-19'),
    genero: UserGenero.MASCULINO,
    telefono: '+34 612 349 003',
    isActive: false, // Pending doctor verification on web
    seniorMode: false,
    especialidad: Especialidad.NEUROLOGIA,
    verificationCode: 'NORD-2024',
    slots: ['16:00', '17:00', '18:00'],
  },
];

// ─── Medicaciones ────────────────────────────────────────────────────────────

export const medicationsSeed = [
  {
    name: 'Ibuprofeno',
    description:
      'Antiinflamatorio no esteroideo (AINE) para dolor leve a moderado.',
  },
  {
    name: 'Paracetamol',
    description: 'Analgésico y antipirético para alivio del dolor y la fiebre.',
  },
  {
    name: 'Metformina',
    description:
      'Medicamento oral para el control de la glucosa en diabetes tipo 2.',
  },
  {
    name: 'Losartán',
    description: 'Antihipertensivo usado para tratar la presión arterial alta.',
  },
  {
    name: 'Atorvastatina',
    description: 'Estatina para reducir el colesterol y triglicéridos.',
  },
  {
    name: 'Omeprazol',
    description:
      'Inhibidor de la bomba de protones para el reflujo ácido y gastritis.',
  },
];
