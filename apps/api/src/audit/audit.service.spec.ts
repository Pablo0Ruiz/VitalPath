import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { AuditService } from './audit.service';
import { AuditLog } from './entities/audit-log.entity';

// ─── Model factory ────────────────────────────────────────────────────────────

const makeChain = (resolved: unknown) => ({
  sort: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  lean: jest.fn().mockReturnThis(),
  exec: jest.fn().mockResolvedValue(resolved),
});

const makeAuditLogModel = () => ({
  create: jest.fn(),
  find: jest.fn(),
});

// ─── Suite ────────────────────────────────────────────────────────────────────

describe('AuditService', () => {
  let service: AuditService;
  let auditLogModel: ReturnType<typeof makeAuditLogModel>;

  beforeEach(async () => {
    auditLogModel = makeAuditLogModel();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditService,
        { provide: getModelToken(AuditLog.name), useValue: auditLogModel },
      ],
    }).compile();

    service = module.get<AuditService>(AuditService);
  });

  beforeEach(() => jest.clearAllMocks());

  // ─── logAction smoke ───────────────────────────────────────────────────────

  describe('logAction', () => {
    it('creates an audit log document', async () => {
      auditLogModel.create.mockResolvedValue({});

      await service.logAction(
        'VIEW_MEDICAL_DATA',
        'user1',
        'resource1',
        '127.0.0.1',
        'detail',
      );

      expect(auditLogModel.create).toHaveBeenCalledWith({
        action: 'VIEW_MEDICAL_DATA',
        userId: 'user1',
        resourceId: 'resource1',
        ipAddress: '127.0.0.1',
        details: 'detail',
      });
    });
  });

  // ─── findAll ───────────────────────────────────────────────────────────────

  describe('findAll', () => {
    it('returns all logs with no filter, sorted desc, limited to 200', async () => {
      const docs = [{ _id: '1', action: 'A' }];
      const chain = makeChain(docs);
      auditLogModel.find.mockReturnValue(chain);

      const result = await service.findAll({});

      expect(auditLogModel.find).toHaveBeenCalledWith({});
      expect(chain.sort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(chain.limit).toHaveBeenCalledWith(200);
      expect(result).toBe(docs);
    });

    it('filters by userId when provided', async () => {
      const chain = makeChain([]);
      auditLogModel.find.mockReturnValue(chain);

      await service.findAll({ userId: 'user42' });

      expect(auditLogModel.find).toHaveBeenCalledWith(
        expect.objectContaining({ userId: 'user42' }),
      );
    });

    it('filters by action when provided', async () => {
      const chain = makeChain([]);
      auditLogModel.find.mockReturnValue(chain);

      await service.findAll({ action: 'VIEW_MEDICAL_DATA' });

      expect(auditLogModel.find).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'VIEW_MEDICAL_DATA' }),
      );
    });

    it('filters by date range when from and to are provided', async () => {
      const chain = makeChain([]);
      auditLogModel.find.mockReturnValue(chain);

      const from = new Date('2025-01-01T00:00:00Z');
      const to = new Date('2025-01-31T23:59:59Z');

      await service.findAll({ from, to });

      expect(auditLogModel.find).toHaveBeenCalledWith(
        expect.objectContaining({
          createdAt: { $gte: from, $lte: to },
        }),
      );
    });

    it('composes all filters simultaneously', async () => {
      const chain = makeChain([]);
      auditLogModel.find.mockReturnValue(chain);

      const from = new Date('2025-01-01T00:00:00Z');

      await service.findAll({ userId: 'u1', action: 'WRITE', from });

      expect(auditLogModel.find).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'u1',
          action: 'WRITE',
          createdAt: { $gte: from },
        }),
      );
    });

    it('returns empty array when no documents match', async () => {
      const chain = makeChain([]);
      auditLogModel.find.mockReturnValue(chain);

      const result = await service.findAll({ userId: 'nonexistent' });

      expect(result).toEqual([]);
    });

    it('respects a custom limit when provided', async () => {
      const chain = makeChain([]);
      auditLogModel.find.mockReturnValue(chain);

      await service.findAll({ limit: 50 });

      expect(chain.limit).toHaveBeenCalledWith(50);
    });
  });
});
