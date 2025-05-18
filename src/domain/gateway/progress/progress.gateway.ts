// Entity
import { Progress } from "../../entity/progress/Progress";

export interface ProgressGateway {
  create(progress: Progress): Promise<void>;
  update(progress: Progress): Promise<void>;
  findById(id: string): Promise<Progress | null>;
  findByJourneyId(journeyId: string): Promise<Progress | null>;
  resumeStatistics(idUser: string): Promise<Progress[]>;
  deactivate(id: string): Promise<void>;
}
