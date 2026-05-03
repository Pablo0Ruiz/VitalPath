import { BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';
import { ParseMongoIdPipe } from './parse-mongo-id.pipe';

describe('ParseMongoIdPipe', () => {
  let pipe: ParseMongoIdPipe;

  beforeEach(() => {
    pipe = new ParseMongoIdPipe();
  });

  it('returns a valid ObjectId string unchanged', () => {
    const id = new Types.ObjectId().toString();
    expect(pipe.transform(id)).toBe(id);
  });

  it('throws BadRequestException for a non-ObjectId string', () => {
    expect(() => pipe.transform('not-an-id')).toThrow(BadRequestException);
  });

  it('throws BadRequestException for an empty string', () => {
    expect(() => pipe.transform('')).toThrow(BadRequestException);
  });
});
