import { renderHook, act } from '@testing-library/react-native';
import { usePdfData } from '../usePdfData';
import { getPdfAndSummary } from '@repo/api-client';
import { IMedicalResults } from '@repo/types';

jest.mock('@repo/api-client', () => ({
  getPdfAndSummary: jest.fn(),
}));

const mockStudy = {
  fileUrl: 'test-url.pdf',
} as unknown as IMedicalResults;

describe('usePdfData Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return null if study is undefined', async () => {
    const { result } = renderHook(() => usePdfData());

    const data = await act(async () => {
      return await result.current.fetchPdfData({ study: undefined });
    });

    expect(data).toBeNull();
    expect(getPdfAndSummary).not.toHaveBeenCalled();
  });

  it('should fetch PDF data successfully and cache it', async () => {
    const mockResponse = { publicUrl: 'public-url.pdf', resumen: 'Summary' };
    (getPdfAndSummary as jest.Mock).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => usePdfData());

    const data = await act(async () => {
      return await result.current.fetchPdfData({ study: mockStudy });
    });

    expect(data).toEqual(mockResponse);
    expect(getPdfAndSummary).toHaveBeenCalledWith('test-url.pdf');
    expect(result.current.pdfCache['test-url.pdf']).toEqual(mockResponse);
  });

  it('should return cached data on subsequent calls instead of fetching again', async () => {
    const mockResponse = { publicUrl: 'public-url.pdf', resumen: 'Summary' };
    (getPdfAndSummary as jest.Mock).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => usePdfData());

    // First call
    await act(async () => {
      await result.current.fetchPdfData({ study: mockStudy });
    });

    // Second call
    const data = await act(async () => {
      return await result.current.fetchPdfData({ study: mockStudy });
    });

    expect(data).toEqual(mockResponse);
    expect(getPdfAndSummary).toHaveBeenCalledTimes(1); // Still 1!
  });

  it('should handle API errors gracefully and cache error state', async () => {
    (getPdfAndSummary as jest.Mock).mockRejectedValue(
      new Error('Network Error'),
    );

    const { result } = renderHook(() => usePdfData());

    const data = await act(async () => {
      return await result.current.fetchPdfData({ study: mockStudy });
    });

    expect(data).toBeNull();
    expect(result.current.pdfCache['test-url.pdf']).toEqual('error');
  });

  it('should return null if cached state is error on subsequent calls', async () => {
    (getPdfAndSummary as jest.Mock).mockRejectedValue(
      new Error('Network Error'),
    );

    const { result } = renderHook(() => usePdfData());

    await act(async () => {
      await result.current.fetchPdfData({ study: mockStudy });
    });

    // Second call, should return null immediately
    const data = await act(async () => {
      return await result.current.fetchPdfData({ study: mockStudy });
    });

    expect(data).toBeNull();
    expect(getPdfAndSummary).toHaveBeenCalledTimes(1); // Doesn't retry if cached 'error'
  });
});
