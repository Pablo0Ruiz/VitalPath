'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/atoms/Card';
import { Badge } from '@/components/ui/atoms/Badge';
import { Button } from '@/components/ui/atoms/Button';
import { Modal } from '@/components/ui/atoms/Modal';
import { useMedicalResults, getPdfAndSummary } from '@repo/api-client';
import { IMedicalResults } from '@repo/types';

type CacheEntry = { publicUrl: string; resumen: string } | 'loading' | 'error';
type ActiveModal = { type: 'pdf' | 'summary'; fileUrl: string } | null;

const ReportHistory = () => {
  const { data: medicalResults, isLoading } = useMedicalResults();
  const [cache, setCache] = useState<Record<string, CacheEntry>>({});
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);

  if (!medicalResults && isLoading) {
    return <div>Cargando estudios...</div>;
  }
  if (!medicalResults && !isLoading) {
    return (
      <div className="flex items-center justify-center">No hay estudios</div>
    );
  }

  const handleOpenModal = async (type: 'pdf' | 'summary', fileUrl: string) => {
    const cached = cache[fileUrl];
    if (cached && cached !== 'loading') {
      setActiveModal({ type, fileUrl });
      return;
    }
    setCache(prev => ({ ...prev, [fileUrl]: 'loading' }));
    try {
      const result = await getPdfAndSummary(fileUrl);
      setCache(prev => ({ ...prev, [fileUrl]: result }));
      setActiveModal({ type, fileUrl });
    } catch {
      setCache(prev => ({ ...prev, [fileUrl]: 'error' }));
      setActiveModal({ type, fileUrl });
    }
  };

  const handleClose = () => setActiveModal(null);

  const activeCacheEntry = activeModal ? cache[activeModal.fileUrl] : null;

  return (
    <>
      <Card padding="none" className="relative overflow-hidden flex flex-col">
        <div className="absolute inset-x-0 top-0 h-[3px] bg-linear-to-r from-brand-accent-ai to-brand-primary-500" />
        <div className="px-5 pt-6 pb-4 border-b border-brand-border">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-brand-text-secondary">
              Historial de estudios
            </h3>
          </div>
        </div>
        <div className="p-4 flex flex-col gap-2.5">
          {medicalResults?.map((study: IMedicalResults) => (
            <div
              key={study._id}
              className="flex items-center justify-between gap-3 px-4 py-3 bg-brand-background/60 rounded-xl border border-brand-border/60 hover:bg-brand-primary-50/20 transition-colors"
            >
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-sm font-medium text-brand-text-primary truncate">
                  {study.paciente_ID.name} {study.paciente_ID.lastName}
                </span>
                <span className="text-xs text-brand-text-secondary">
                  {study.cita_ID?.fecha ||
                    new Date(study.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge variant="success" size="sm">
                  Resumen listo
                </Badge>
                <Button
                  onClick={() => handleOpenModal('pdf', study.fileUrl)}
                  variant="ghost"
                  size="sm"
                  disabled={cache[study.fileUrl] === 'loading'}
                >
                  {cache[study.fileUrl] === 'loading'
                    ? 'Cargando...'
                    : 'Ver PDF'}
                </Button>
                <Button
                  onClick={() => handleOpenModal('summary', study.fileUrl)}
                  variant="outline"
                  size="sm"
                  disabled={cache[study.fileUrl] === 'loading'}
                >
                  Ver resumen IA
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Modal
        isOpen={activeModal?.type === 'pdf'}
        onClose={handleClose}
        title="Estudio PDF"
      >
        {activeCacheEntry === 'loading' && (
          <p className="text-sm text-brand-text-secondary">Cargando PDF...</p>
        )}
        {activeCacheEntry === 'error' && (
          <p className="text-sm text-red-500">No se pudo cargar el PDF.</p>
        )}
        {activeCacheEntry &&
          activeCacheEntry !== 'loading' &&
          activeCacheEntry !== 'error' && (
            <div className="flex flex-col gap-3">
              <iframe
                src={activeCacheEntry.publicUrl}
                className="w-full h-[65vh] rounded-lg border border-brand-border"
                title="Estudio PDF"
              />
              <a
                href={activeCacheEntry.publicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-brand-primary-600 underline self-end"
              >
                Abrir en nueva pestaña
              </a>
            </div>
          )}
      </Modal>

      <Modal
        isOpen={activeModal?.type === 'summary'}
        onClose={handleClose}
        title="Resumen IA"
      >
        {activeCacheEntry === 'loading' && (
          <p className="text-sm text-brand-text-secondary">
            Generando resumen...
          </p>
        )}
        {activeCacheEntry === 'error' && (
          <p className="text-sm text-red-500">No se pudo obtener el resumen.</p>
        )}
        {activeCacheEntry &&
          activeCacheEntry !== 'loading' &&
          activeCacheEntry !== 'error' && (
            <p className="text-sm text-brand-text-primary leading-relaxed whitespace-pre-wrap">
              {activeCacheEntry.resumen}
            </p>
          )}
      </Modal>
    </>
  );
};

export default ReportHistory;
