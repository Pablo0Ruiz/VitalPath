import { BadRequestException } from '@nestjs/common';
import pdf from 'pdf-parse';
import { processChatFiles } from './process-chat-files';

jest.mock('pdf-parse');

describe('processChatFiles', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return an empty array if no files are provided', async () => {
    const result = await processChatFiles([]);
    expect(result).toEqual([]);
  });

  it('should throw BadRequestException if a file is not a PDF', async () => {
    const files = [
      {
        mimetype: 'image/png',
        originalname: 'test.png',
        buffer: Buffer.from(''),
      } as unknown as Express.Multer.File,
    ];
    await expect(processChatFiles(files)).rejects.toThrow(BadRequestException);
  });

  it('should extract text from PDF files', async () => {
    const files = [
      {
        mimetype: 'application/pdf',
        buffer: Buffer.from('pdf1'),
        originalname: '1.pdf',
      } as unknown as Express.Multer.File,
      {
        mimetype: 'application/octet-stream',
        buffer: Buffer.from('pdf2'),
        originalname: '2.pdf',
      } as unknown as Express.Multer.File,
    ];

    (pdf as jest.Mock)
      .mockResolvedValueOnce({ text: 'text1' })
      .mockResolvedValueOnce({ text: '  text2  ' });

    const result = await processChatFiles(files);

    expect(result).toEqual(['text1', 'text2']);
    expect(pdf).toHaveBeenCalledTimes(2);
  });

  it('should filter out empty extracted text', async () => {
    const files = [
      {
        mimetype: 'application/pdf',
        buffer: Buffer.from('pdf1'),
        originalname: '1.pdf',
      } as unknown as Express.Multer.File,
    ];
    (pdf as jest.Mock).mockResolvedValue({ text: '' });

    const result = await processChatFiles(files);

    expect(result).toEqual([]);
  });
});
