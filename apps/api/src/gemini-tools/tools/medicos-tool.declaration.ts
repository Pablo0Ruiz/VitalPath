import { FunctionDeclaration, Type } from '@google/genai';

/**
 * Tool to list all doctors.
 * Required: None.
 */
export const getDoctorsToolDeclaration: FunctionDeclaration = {
  name: 'getDoctors',
  description: 'Lista todos los médicos disponibles.',
  parameters: {
    type: Type.OBJECT,
    properties: {},
    required: [],
  },
};

export const medicosTools = [getDoctorsToolDeclaration];
