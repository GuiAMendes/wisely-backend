// Entity
import { Progress } from "../../entity/progress/Progress";

export interface ProgressGateway {
  create(progress: Progress): Promise<Progress>;
  update(progress: Progress): Promise<Progress>;
  findById(id: string): Promise<Progress | null>;
  findByJourneyId(journeyId: string): Promise<Progress | null>;
  resumeStatistics(idUser: string): Promise<Progress[]>;
  deactivate(id: string): Promise<Progress>;
}
