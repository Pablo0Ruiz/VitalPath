import { useState } from 'react';
import { getPdfAndSummary } from '@repo/api-client';
import { IMedicalResults } from '@repo/types';

export type PdfEntry =
  | { publicUrl: string; resumen: string }
  | 'loading'
  | 'error';

export interface FetchDfDataProps {
  study: IMedicalResults | undefined;
}
export const usePdfData = () => {
  const [pdfCache, setPdfCache] = useState<Record<string, PdfEntry>>({});
  const fetchPdfData = async ({
    study,
  }: FetchDfDataProps): Promise<{
    publicUrl: string;
    resumen: string;
  } | null> => {
    if (!study) return null;
    const cached = pdfCache[study.fileUrl];
    if (cached && cached !== 'loading') {
      return cached === 'error' ? null : cached;
    }
    setPdfCache(prev => ({ ...prev, [study.fileUrl]: 'loading' }));
    try {
      const result = await getPdfAndSummary(study.fileUrl);
      setPdfCache(prev => ({ ...prev, [study.fileUrl]: result }));
      return result;
    } catch {
      setPdfCache(prev => ({ ...prev, [study.fileUrl]: 'error' }));
      return null;
    }
  };
  return {
    pdfCache,
    fetchPdfData,
  };
};
