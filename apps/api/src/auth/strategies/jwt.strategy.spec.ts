import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { Types } from 'mongoose';
import { JwtStrategy } from './jwt.strategy';
import { User } from '../entities/user.entity';

const makeUserModel = () => ({
  findById: jest.fn(),
});

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let userModel: ReturnType<typeof makeUserModel>;

  beforeEach(async () => {
    userModel = makeUserModel();

    const module = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        { provide: getModelToken(User.name), useValue: userModel },
        { provide: ConfigService, useValue: { get: () => 'test-jwt-secret' } },
      ],
    }).compile();

    strategy = module.get(JwtStrategy);
  });

  it('returns the user when found by payload id', async () => {
    const id = new Types.ObjectId().toString();
    const user = { _id: id, id, email: 'u@example.com' };
    userModel.findById.mockResolvedValue(user);

    const result = await strategy.validate({ id });

    expect(result).toBe(user);
    expect(userModel.findById).toHaveBeenCalledWith(id);
  });

  it('throws UnauthorizedException when the user does not exist', async () => {
    userModel.findById.mockResolvedValue(null);

    await expect(strategy.validate({ id: 'some-id' })).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('throws UnauthorizedException when the returned user has no id (corrupted document)', async () => {
    userModel.findById.mockResolvedValue({
      _id: new Types.ObjectId(),
      id: null,
    });

    await expect(strategy.validate({ id: 'some-id' })).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
