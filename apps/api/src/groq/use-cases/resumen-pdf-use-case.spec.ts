import { generateText } from 'ai';
import { createGroq } from '@ai-sdk/groq';
import pdf from 'pdf-parse';
import { resumenPdf } from './resumen-pdf-use-case';

jest.mock('ai');
jest.mock('@ai-sdk/groq');
jest.mock('pdf-parse');

describe('resumenPdf', () => {
  const base64Data = Buffer.from('fake pdf').toString('base64');

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.GROQ_API_KEY = 'test-key';
  });

  it('should return a summary when PDF text is extracted', async () => {
    (pdf as jest.Mock).mockResolvedValue({ text: 'Extracted text from PDF' });
    const mockGroq = jest.fn();
    (createGroq as jest.Mock).mockReturnValue(mockGroq);
    (generateText as jest.Mock).mockResolvedValue({
      text: 'This is a summary',
    });

    const result = await resumenPdf(base64Data);

    expect(pdf).toHaveBeenCalled();
    expect(generateText).toHaveBeenCalledWith(
      expect.objectContaining({
        prompt: expect.stringContaining('Extracted text from PDF'),
      }),
    );
    expect(result).toBe('This is a summary');
  });

  it('should return fallback message when no text is extracted', async () => {
    (pdf as jest.Mock).mockResolvedValue({ text: '' });

    const result = await resumenPdf(base64Data);

    expect(result).toBe(
      'No se pudo extraer texto del PDF (puede tratarse de un documento escaneado o protegido).',
    );
    expect(generateText).not.toHaveBeenCalled();
  });
});
