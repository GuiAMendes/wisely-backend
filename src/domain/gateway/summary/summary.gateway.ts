// Entity
import { Summary } from "../../entity/summary/Summary";

export interface SummaryGateway {
  create(Summary: Summary): Promise<void>;
  update(Summary: Summary): Promise<void>;
  findById(id: string): Promise<Summary | null>;
  findByTopic(topicId: string): Promise<Summary | null>;
  complete(id: string): Promise<void>;
  deactivate(id: string): Promise<void>;
}
