import type { Visit } from '../entities';

export interface VisitsRepository {
  create(visit: Visit): Promise<Visit>;
}
