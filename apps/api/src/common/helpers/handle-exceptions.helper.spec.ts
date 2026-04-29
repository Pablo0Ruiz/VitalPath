import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { handleServiceException } from './handle-exceptions.helper';

describe('handleServiceException', () => {
  beforeEach(() =>
    jest.spyOn(console, 'error').mockImplementation(() => undefined),
  );
  afterEach(() => jest.restoreAllMocks());
  it('throws BadRequestException when error has code 11000 (duplicate key)', () => {
    expect(() => handleServiceException({ code: 11000 })).toThrow(
      BadRequestException,
    );
  });

  it('throws InternalServerErrorException for a non-11000 error code', () => {
    expect(() => handleServiceException({ code: 500 })).toThrow(
      InternalServerErrorException,
    );
  });

  it('throws InternalServerErrorException for a generic Error instance', () => {
    expect(() => handleServiceException(new Error('boom'))).toThrow(
      InternalServerErrorException,
    );
  });
});
