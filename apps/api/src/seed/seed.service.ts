import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { User } from 'src/auth/entities/user.entity';
import { Doctor } from 'src/user/entities/doctor.entity';
import { Patient } from 'src/user/entities/patient.entity';
import { CentroSalud } from 'src/user/entities/centro-salud.entity';
import { Appointment } from 'src/appointment/entities/appointment.entity';
import { Medication } from 'src/medications/entities/medication.entity';
import { Mood } from 'src/mood/entities/mood.entity';
import { ResultadoEstudio } from 'src/user/entities/resultado-estudio.entity';
import { VinculacionPacienteCuidador } from 'src/vinculacion/entities/vinculacion.entity';

import {
  SEED_PASSWORD,
  centrosSaludSeed,
  adminSeed,
  caregiverSeed,
  pacientesSinCodigoSeed,
  pacientesConCodigoSeed,
  personasMayoresSeed,
  doctoresVerificadosSeed,
  doctoresPendientesSeed,
  medicationsSeed,
} from './seed-data';

import { UserRoles } from 'src/auth/enum/user-role.enum';
import { TipoVinculo } from 'src/vinculacion/enum/tipo-vinculo.enum';
import { EstadoVinculo } from 'src/vinculacion/enum/estado-vinculo.enum';
import { CitaState } from 'src/appointment/dto/enum/cita-state.enum';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    @InjectModel(Doctor.name)
    private readonly doctorModel: Model<Doctor>,
    @InjectModel(Patient.name)
    private readonly patientModel: Model<Patient>,
    @InjectModel(CentroSalud.name)
    private readonly centroSaludModel: Model<CentroSalud>,
    @InjectModel(Appointment.name)
    private readonly appointmentModel: Model<Appointment>,
    @InjectModel(Medication.name)
    private readonly medicationModel: Model<Medication>,
    @InjectModel(Mood.name)
    private readonly moodModel: Model<Mood>,
    @InjectModel(ResultadoEstudio.name)
    private readonly resultadoEstudioModel: Model<ResultadoEstudio>,
    @InjectModel(VinculacionPacienteCuidador.name)
    private readonly vinculacionModel: Model<VinculacionPacienteCuidador>,
  ) {}

  private async cleanDatabase(): Promise<void> {
    this.logger.log('Limpiando base de datos...');

    await this.appointmentModel.deleteMany({});
    await this.medicationModel.deleteMany({});
    await this.moodModel.deleteMany({});
    await this.resultadoEstudioModel.deleteMany({});
    await this.doctorModel.deleteMany({});
    await this.patientModel.deleteMany({});
    await this.userModel.deleteMany({});
    await this.centroSaludModel.deleteMany({});
    await this.vinculacionModel.deleteMany({});

    this.logger.log('Base de datos limpia.');
  }

  async runSeed() {
    await this.cleanDatabase();

    const hashedPassword = bcrypt.hashSync(SEED_PASSWORD, 12);

    // 1. Crear Centros de Salud
    const centros = await this.centroSaludModel.insertMany(centrosSaludSeed);
    const [centroNord, centroRosa] = centros;
    this.logger.log(`Centros de salud creados: ${centros.length}`);

    // 2. Crear Administrador
    const _adminUser = await this.userModel.create({
      ...adminSeed,
      password: hashedPassword,
    });
    this.logger.log('Usuario Administrador creado.');

    // 3. Crear Cuidador Familiar
    const caregiverUser = await this.userModel.create({
      ...caregiverSeed,
      password: hashedPassword,
    });
    this.logger.log('Usuario Cuidador Familiar creado.');

    // 4. Crear Medicaciones
    const medications = await this.medicationModel.insertMany(medicationsSeed);
    this.logger.log(`Medicaciones creadas: ${medications.length}`);

    const findMed = (name: string) =>
      medications.find(m => m.name.toLowerCase() === name.toLowerCase());

    // 5. Crear Pacientes sin código (y trabajadores centro)
    const usersSinCodigo = await this.userModel.insertMany(
      pacientesSinCodigoSeed.map(u => ({ ...u, password: hashedPassword })),
    );

    const patientDocs = [];
    for (let i = 0; i < usersSinCodigo.length; i++) {
      const u = usersSinCodigo[i];
      const originalData = pacientesSinCodigoSeed[i];

      if (u.role === UserRoles.PACIENTE) {
        const assignedMeds = [];
        if (u.name === 'carlos') {
          const med1 = findMed('omeprazol');
          const med2 = findMed('paracetamol');
          if (med1) assignedMeds.push(med1._id);
          if (med2) assignedMeds.push(med2._id);
        } else if (u.name === 'miguel') {
          const med1 = findMed('ibuprofeno');
          if (med1) assignedMeds.push(med1._id);
        }
        patientDocs.push({
          user: u._id,
          medications: assignedMeds,
          citas: [],
          resultadosEstudio: [],
        });
      } else if (
        u.role === UserRoles.TRABAJADOR_CENTRO &&
        originalData.verificationCode
      ) {
        if (u.isActive) {
          const centro = centros.find(
            c => c.codigoVinculacion === originalData.verificationCode,
          );
          if (centro) {
            await this.userModel.findByIdAndUpdate(u._id, {
              centroSalud_ID: centro._id,
            });
            await this.centroSaludModel.findByIdAndUpdate(centro._id, {
              $push: { listaTrabajadores_ID: u._id },
            });
          }
        }
      }
    }
    if (patientDocs.length > 0) {
      await this.patientModel.insertMany(patientDocs);
    }
    this.logger.log(`Usuarios base creados: ${usersSinCodigo.length}`);

    // 6. Crear Pacientes con código
    const usersConCodigo = await this.userModel.insertMany(
      pacientesConCodigoSeed.map(u => ({ ...u, password: hashedPassword })),
    );
    await this.patientModel.insertMany(
      usersConCodigo.map(u => ({
        user: u._id,
        medications: [],
        citas: [],
        resultadosEstudio: [],
      })),
    );
    this.logger.log(`Pacientes con código creados: ${usersConCodigo.length}`);

    // 7. Crear Personas mayores (65+)
    const usersMayores = await this.userModel.insertMany(
      personasMayoresSeed.map(u => ({ ...u, password: hashedPassword })),
    );
    const patientMayoresDocs = [];
    for (const u of usersMayores) {
      const assignedMeds = [];
      if (u.name === 'rosa') {
        const med1 = findMed('losartán');
        const med2 = findMed('atorvastatina');
        if (med1) assignedMeds.push(med1._id);
        if (med2) assignedMeds.push(med2._id);
      } else if (u.name === 'manuel') {
        const med1 = findMed('metformina');
        const med2 = findMed('losartán');
        if (med1) assignedMeds.push(med1._id);
        if (med2) assignedMeds.push(med2._id);
      } else if (u.name === 'josé') {
        const med1 = findMed('atorvastatina');
        if (med1) assignedMeds.push(med1._id);
      } else if (u.name === 'maría') {
        const med1 = findMed('ibuprofeno');
        const med2 = findMed('omeprazol');
        if (med1) assignedMeds.push(med1._id);
        if (med2) assignedMeds.push(med2._id);
      }
      patientMayoresDocs.push({
        user: u._id,
        medications: assignedMeds,
        citas: [],
        resultadosEstudio: [],
      });
    }
    await this.patientModel.insertMany(patientMayoresDocs);
    this.logger.log(`Personas mayores creadas: ${usersMayores.length}`);

    // 8. Crear Doctores verificados y vincularlos a centros
    const centrosPorIndex = [centroNord, centroRosa];

    const usersDoctoresVerificados = await this.userModel.insertMany(
      doctoresVerificadosSeed.map(
        ({ centroIndex, especialidad: _, slots: __, ...rest }) => ({
          ...rest,
          password: hashedPassword,
          centroSalud_ID: centrosPorIndex[centroIndex]._id,
        }),
      ),
    );

    await this.doctorModel.insertMany(
      doctoresVerificadosSeed.map((d, i) => ({
        user: usersDoctoresVerificados[i]._id,
        especialidad: d.especialidad,
        slots: d.slots,
        citas: [],
      })),
    );

    const medicosPorCentro: Record<number, Types.ObjectId[]> = { 0: [], 1: [] };
    doctoresVerificadosSeed.forEach((d, i) => {
      medicosPorCentro[d.centroIndex].push(
        usersDoctoresVerificados[i]._id as Types.ObjectId,
      );
    });

    await this.centroSaludModel.findByIdAndUpdate(centroNord._id, {
      $push: { listaMedicos_ID: { $each: medicosPorCentro[0] } },
    });
    await this.centroSaludModel.findByIdAndUpdate(centroRosa._id, {
      $push: { listaMedicos_ID: { $each: medicosPorCentro[1] } },
    });

    this.logger.log(
      `Doctores verificados creados: ${usersDoctoresVerificados.length}`,
    );

    // 9. Crear Doctores pendientes
    const usersDoctoresPendientes = await this.userModel.insertMany(
      doctoresPendientesSeed.map(({ especialidad: _, slots: __, ...rest }) => ({
        ...rest,
        password: hashedPassword,
      })),
    );

    await this.doctorModel.insertMany(
      doctoresPendientesSeed.map((d, i) => ({
        user: usersDoctoresPendientes[i]._id,
        especialidad: d.especialidad,
        slots: d.slots,
        citas: [],
      })),
    );
    this.logger.log(
      `Doctores pendientes creados: ${usersDoctoresPendientes.length}`,
    );

    // 10. Crear Vínculos Paciente-Cuidador
    const sofiaUser = usersConCodigo.find(p => p.name === 'sofía');
    const manuelUser = usersMayores.find(p => p.name === 'manuel');

    if (caregiverUser && sofiaUser && manuelUser) {
      await this.vinculacionModel.insertMany([
        {
          cuidador_id: caregiverUser._id,
          paciente_id: sofiaUser._id,
          tipo_vinculo: TipoVinculo.HIJO_A,
          estado_vinculo: EstadoVinculo.ACTIVO,
        },
        {
          cuidador_id: caregiverUser._id,
          paciente_id: manuelUser._id,
          tipo_vinculo: TipoVinculo.CUIDADOR_CONTRATADO,
          estado_vinculo: EstadoVinculo.PENDIENTE,
          codigo_lookup: 'LOOKUP123',
          codigo_vinculacion: 'VINC-555',
          codigoExpireAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      ]);
      this.logger.log('Vínculos de cuidadores creados.');
    }

    // 11. Generar Citas Dinámicas
    const todayStr = new Date().toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    // Doctors
    const drGomez = usersDoctoresVerificados.find(
      d => d.email === 'roberto.gomez@test.com',
    );
    const drVargas = usersDoctoresVerificados.find(
      d => d.email === 'elena.vargas@test.com',
    );
    const drFrancisco = usersDoctoresVerificados.find(
      d => d.email === 'francisco.jimenez@test.com',
    );
    const drPatricia = usersDoctoresVerificados.find(
      d => d.email === 'patricia.reyes@test.com',
    );
    const drAlejandro = usersDoctoresVerificados.find(
      d => d.email === 'alejandro.silva@test.com',
    );

    // Patients
    const carlos = usersSinCodigo.find(
      p => p.email === 'carlos.martinez@test.com',
    );
    const laura = usersSinCodigo.find(
      p => p.email === 'laura.sanchez@test.com',
    );
    const miguel = usersSinCodigo.find(
      p => p.email === 'miguel.rodriguez@test.com',
    );
    const ana = usersSinCodigo.find(p => p.email === 'ana.garcia@test.com');
    const pedro = usersSinCodigo.find(p => p.email === 'pedro.lopez@test.com');
    const sofia = usersConCodigo.find(
      p => p.email === 'sofia.hernandez@test.com',
    );
    const diego = usersConCodigo.find(p => p.email === 'diego.torres@test.com');
    const valentina = usersConCodigo.find(
      p => p.email === 'valentina.ruiz@test.com',
    );
    const andres = usersConCodigo.find(
      p => p.email === 'andres.moreno@test.com',
    );
    const isabella = usersConCodigo.find(
      p => p.email === 'isabella.castro@test.com',
    );
    const rosa = usersMayores.find(p => p.email === 'rosa.fernandez@test.com');
    const manuel = usersMayores.find(
      p => p.email === 'manuel.gonzalez@test.com',
    );
    const carmen = usersMayores.find(p => p.email === 'carmen.diaz@test.com');
    const jose = usersMayores.find(p => p.email === 'jose.perez@test.com');
    const maria = usersMayores.find(p => p.email === 'maria.lopez@test.com');

    const appointmentsToCreate = [];

    // Dr. Gómez (Cardiología, Hospital Norte) — slots: 09:00–16:00
    // Cubre todos los estados posibles de una cita
    if (drGomez && carlos && laura && miguel && ana && pedro && sofia) {
      appointmentsToCreate.push(
        {
          paciente_ID: carlos._id,
          medico_ID: drGomez._id,
          centroSalud_ID: centroNord._id,
          fecha: todayStr,
          hora: '16:00',
          estado: CitaState.AGENDADA,
        },
        {
          paciente_ID: laura._id,
          medico_ID: drGomez._id,
          centroSalud_ID: centroNord._id,
          fecha: todayStr,
          hora: '10:00',
          estado: CitaState.ASISTIDA,
        },
        {
          paciente_ID: miguel._id,
          medico_ID: drGomez._id,
          centroSalud_ID: centroNord._id,
          fecha: todayStr,
          hora: '11:00',
          estado: CitaState.EN_PROCESO,
        },
        {
          paciente_ID: ana._id,
          medico_ID: drGomez._id,
          centroSalud_ID: centroNord._id,
          fecha: todayStr,
          hora: '12:00',
          estado: CitaState.RESULTADOS_LISTOS,
        },
        {
          paciente_ID: pedro._id,
          medico_ID: drGomez._id,
          centroSalud_ID: centroNord._id,
          fecha: todayStr,
          hora: '13:00',
          estado: CitaState.COMPLETADA,
        },
        {
          paciente_ID: sofia._id,
          medico_ID: drGomez._id,
          centroSalud_ID: centroNord._id,
          fecha: todayStr,
          hora: '14:00',
          estado: CitaState.CANCELADA,
        },
      );
    }
    // Dr. Gómez — citas futuras para seniors (cardiology + edad avanzada = match perfecto)
    if (drGomez && rosa && manuel) {
      appointmentsToCreate.push(
        {
          paciente_ID: rosa._id,
          medico_ID: drGomez._id,
          centroSalud_ID: centroNord._id,
          fecha: tomorrowStr,
          hora: '09:00',
          estado: CitaState.AGENDADA,
        },
        {
          paciente_ID: manuel._id,
          medico_ID: drGomez._id,
          centroSalud_ID: centroNord._id,
          fecha: tomorrowStr,
          hora: '10:00',
          estado: CitaState.AGENDADA,
        },
      );
    }

    // Dr. Francisco Jiménez (Neurología, Hospital Norte) — slots: 15:00, 16:00, 17:00
    if (drFrancisco && andres && jose && maria) {
      appointmentsToCreate.push(
        {
          paciente_ID: andres._id,
          medico_ID: drFrancisco._id,
          centroSalud_ID: centroNord._id,
          fecha: todayStr,
          hora: '15:00',
          estado: CitaState.AGENDADA,
        },
        {
          paciente_ID: jose._id,
          medico_ID: drFrancisco._id,
          centroSalud_ID: centroNord._id,
          fecha: todayStr,
          hora: '16:00',
          estado: CitaState.COMPLETADA,
        },
        {
          paciente_ID: maria._id,
          medico_ID: drFrancisco._id,
          centroSalud_ID: centroNord._id,
          fecha: todayStr,
          hora: '17:00',
          estado: CitaState.ASISTIDA,
        },
      );
    }

    // Dra. Patricia Reyes (Nutrición, Clínica Rosa) — slots: 12:00, 13:00, 14:00
    if (drPatricia && isabella && carmen && valentina) {
      appointmentsToCreate.push(
        {
          paciente_ID: isabella._id,
          medico_ID: drPatricia._id,
          centroSalud_ID: centroRosa._id,
          fecha: todayStr,
          hora: '12:00',
          estado: CitaState.AGENDADA,
        },
        {
          paciente_ID: carmen._id,
          medico_ID: drPatricia._id,
          centroSalud_ID: centroRosa._id,
          fecha: todayStr,
          hora: '13:00',
          estado: CitaState.ASISTIDA,
        },
        {
          paciente_ID: valentina._id,
          medico_ID: drPatricia._id,
          centroSalud_ID: centroRosa._id,
          fecha: tomorrowStr,
          hora: '14:00',
          estado: CitaState.AGENDADA,
        },
      );
    }

    // Dr. Alejandro Silva (Traumatología, Hospital Norte) — slots: 08:00, 09:00, 10:00
    if (drAlejandro && pedro && andres && diego) {
      appointmentsToCreate.push(
        {
          paciente_ID: pedro._id,
          medico_ID: drAlejandro._id,
          centroSalud_ID: centroNord._id,
          fecha: tomorrowStr,
          hora: '08:00',
          estado: CitaState.AGENDADA,
        },
        {
          paciente_ID: andres._id,
          medico_ID: drAlejandro._id,
          centroSalud_ID: centroNord._id,
          fecha: tomorrowStr,
          hora: '09:00',
          estado: CitaState.AGENDADA,
        },
        {
          paciente_ID: diego._id,
          medico_ID: drAlejandro._id,
          centroSalud_ID: centroNord._id,
          fecha: tomorrowStr,
          hora: '10:00',
          estado: CitaState.AGENDADA,
        },
      );
    }

    // Alerta No-Show: cita AGENDADA con hora pasada (07:00 hoy)
    if (drVargas && diego) {
      appointmentsToCreate.push({
        paciente_ID: diego._id,
        medico_ID: drVargas._id,
        centroSalud_ID: centroRosa._id,
        fecha: todayStr,
        hora: '07:00',
        estado: CitaState.AGENDADA,
      });
    }

    // Alerta Stale Results: RESULTADOS_LISTOS hace más de 24h
    if (drVargas && valentina) {
      appointmentsToCreate.push({
        paciente_ID: valentina._id,
        medico_ID: drVargas._id,
        centroSalud_ID: centroRosa._id,
        fecha: yesterdayStr,
        hora: '09:00',
        estado: CitaState.RESULTADOS_LISTOS,
      });
    }

    // Alerta Doctor Overload: Dra. Elena Vargas con 9 citas hoy (slots válidos)
    const overloadPatients = [
      sofia,
      valentina,
      rosa,
      manuel,
      carlos,
      laura,
      miguel,
      ana,
      carmen,
    ];
    const overloadSlots = [
      '08:00',
      '08:30',
      '09:00',
      '09:30',
      '10:00',
      '10:30',
      '11:00',
      '11:30',
      '12:00',
    ];
    if (drVargas) {
      overloadPatients.forEach((pat, index) => {
        if (pat) {
          appointmentsToCreate.push({
            paciente_ID: pat._id,
            medico_ID: drVargas._id,
            centroSalud_ID: centroRosa._id,
            fecha: todayStr,
            hora: overloadSlots[index],
            estado: CitaState.AGENDADA,
          });
        }
      });
    }

    const createdAppts =
      await this.appointmentModel.insertMany(appointmentsToCreate);

    // Ajustar fecha de actualización para la cita stale (36h atrás)
    const staleAppt = createdAppts.find(
      a => a.fecha === yesterdayStr && a.estado === CitaState.RESULTADOS_LISTOS,
    );
    if (staleAppt) {
      await this.appointmentModel.updateOne(
        { _id: staleAppt._id },
        { $set: { updatedAt: new Date(Date.now() - 36 * 60 * 60 * 1000) } },
        { timestamps: false },
      );
    }

    // Asociar citas a pacientes y doctores
    for (const appt of createdAppts) {
      await this.patientModel.findOneAndUpdate(
        { user: appt.paciente_ID },
        { $push: { citas: appt._id } },
      );
      await this.doctorModel.findOneAndUpdate(
        { user: appt.medico_ID },
        { $push: { citas: appt._id } },
      );
    }
    this.logger.log(`Citas creadas: ${createdAppts.length}`);

    // 12. Crear Resultados de Estudio
    const apptAna = createdAppts.find(
      a =>
        String(a.paciente_ID) === String(ana?._id) &&
        a.estado === CitaState.RESULTADOS_LISTOS,
    );
    const apptValentina = createdAppts.find(
      a =>
        String(a.paciente_ID) === String(valentina?._id) &&
        a.estado === CitaState.RESULTADOS_LISTOS,
    );
    const apptPedro = createdAppts.find(
      a =>
        String(a.paciente_ID) === String(pedro?._id) &&
        a.estado === CitaState.COMPLETADA &&
        String(a.medico_ID) === String(drGomez?._id),
    );
    const apptJose = createdAppts.find(
      a =>
        String(a.paciente_ID) === String(jose?._id) &&
        a.estado === CitaState.COMPLETADA,
    );

    const studyResults = [];
    if (ana && drGomez && apptAna) {
      studyResults.push({
        paciente_ID: ana._id,
        medico_ID: drGomez._id,
        cita_ID: apptAna._id,
        fileUrl: `public/${ana._id}/estudio-sangre.pdf`,
        resumenIA:
          'El hemograma muestra niveles de glóbulos rojos y blancos dentro de los rangos normales. Se observa una ligera disminución en el nivel de hierro sérico, por lo que se recomienda incrementar el consumo de alimentos ricos en hierro o considerar suplementación.',
        notasMedico: 'Paciente presenta fatiga leve. Dieta recomendada.',
      });
    }
    if (valentina && drVargas && apptValentina) {
      studyResults.push({
        paciente_ID: valentina._id,
        medico_ID: drVargas._id,
        cita_ID: apptValentina._id,
        fileUrl: `public/${valentina._id}/radiografia-torax.pdf`,
        resumenIA:
          'Radiografía de tórax sin hallazgos patológicos significativos. Silueta cardíaca de tamaño normal. Campos pulmonares limpios, sin infiltrados ni derrames.',
        notasMedico: 'Control anual. Todo normal.',
      });
    }
    if (pedro && drGomez && apptPedro) {
      studyResults.push({
        paciente_ID: pedro._id,
        medico_ID: drGomez._id,
        cita_ID: apptPedro._id,
        fileUrl: `public/${pedro._id}/electrocardiograma.pdf`,
        resumenIA:
          'Electrocardiograma dentro de parámetros normales. Ritmo sinusal regular, sin alteraciones en la conducción. Frecuencia cardíaca en reposo: 68 lpm.',
        notasMedico: 'Sin novedades. Próximo control en 6 meses.',
      });
    }
    if (jose && drFrancisco && apptJose) {
      studyResults.push({
        paciente_ID: jose._id,
        medico_ID: drFrancisco._id,
        cita_ID: apptJose._id,
        fileUrl: `public/${jose._id}/resonancia-cerebral.pdf`,
        resumenIA:
          'Resonancia magnética cerebral sin lesiones focales ni signos de deterioro estructural significativo. Espacios subaracnoideos conservados para la edad del paciente.',
        notasMedico:
          'Evaluación de control. Se recomienda continuar con actividad física moderada.',
      });
    }

    if (studyResults.length > 0) {
      const createdStudies =
        await this.resultadoEstudioModel.insertMany(studyResults);
      for (const study of createdStudies) {
        await this.patientModel.findOneAndUpdate(
          { user: study.paciente_ID },
          { $push: { resultadosEstudio: study._id } },
        );
      }
    }
    this.logger.log(`Resultados de estudio creados: ${studyResults.length}`);

    // 13. Generar Historial de Estados de Ánimo (Moods) para Gráficas
    const moodEntries = [];
    const patientsForMood = [carlos, rosa, manuel, sofia, ana, jose].filter(
      Boolean,
    );
    for (const pat of patientsForMood) {
      for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        date.setHours(12, i, 0, 0);
        moodEntries.push({
          userId: pat._id,
          mood: String((i % 5) + 1),
          date,
        });
      }
    }
    if (moodEntries.length > 0) {
      await this.moodModel.insertMany(moodEntries);
    }
    this.logger.log(
      `Entradas de estado de ánimo creadas: ${moodEntries.length}`,
    );

    return {
      message: 'Seed ejecutado correctamente',
      credenciales: {
        password: SEED_PASSWORD,
        nota: 'Todos los usuarios comparten esta contraseña',
      },
      stats: {
        centrosSalud: centros.length,
        admin: 1,
        cuidadores: 1,
        medications: medications.length,
        usuariosBase: usersSinCodigo.length,
        pacientesConCodigo: usersConCodigo.length,
        personasMayores: usersMayores.length,
        doctoresVerificados: usersDoctoresVerificados.length,
        doctoresPendientes: usersDoctoresPendientes.length,
        citasCreadas: createdAppts.length,
        estudiosCreados: studyResults.length,
        moodsCreados: moodEntries.length,
      },
    };
  }
}
