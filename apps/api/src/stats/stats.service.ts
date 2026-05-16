import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Appointment } from 'src/appointment/entities/appointment.entity';
import { Patient } from 'src/user/entities/patient.entity';
import { Doctor } from 'src/user/entities/doctor.entity';
import { Mood } from 'src/mood/entities/mood.entity';
import { CitaState } from 'src/appointment/dto/enum/cita-state.enum';
import { StatsSummaryDto } from './dto/stats-summary.dto';

@Injectable()
export class StatsService {
  constructor(
    @InjectModel(Appointment.name)
    private readonly appointmentModel: Model<Appointment>,
    @InjectModel(Patient.name)
    private readonly patientModel: Model<Patient>,
    @InjectModel(Doctor.name)
    private readonly doctorModel: Model<Doctor>,
    @InjectModel(Mood.name)
    private readonly moodModel: Model<Mood>,
  ) {}

  async getSummary(): Promise<StatsSummaryDto> {
    const [totalPatients, totalDoctors, totalMoods, appointmentAgg] =
      await Promise.all([
        this.patientModel.countDocuments(),
        this.doctorModel.countDocuments(),
        this.moodModel.countDocuments(),
        this.appointmentModel.aggregate<{ _id: string; count: number }>([
          { $group: { _id: '$estado', count: { $sum: 1 } } },
        ]),
      ]);

    const allStates = Object.values(CitaState);
    const appointmentsByState: Record<string, number> = Object.fromEntries(
      allStates.map(state => [state, 0]),
    );

    for (const { _id, count } of appointmentAgg) {
      if (_id in appointmentsByState) {
        appointmentsByState[_id] = count;
      }
    }

    return { totalPatients, totalDoctors, appointmentsByState, totalMoods };
  }
}
