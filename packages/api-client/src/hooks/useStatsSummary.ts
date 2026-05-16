import { useQuery } from '@tanstack/react-query';
import { getStatsSummary } from '../actions/stats.actions';
import { statsKeys } from '../queryKeys';

export const useStatsSummary = () => {
  return useQuery({
    queryKey: statsKeys.summary(),
    queryFn: getStatsSummary,
    staleTime: 1000 * 60,
  });
};
