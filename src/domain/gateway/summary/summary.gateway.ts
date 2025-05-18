// Entity
import { Summary } from "../../entity/summary/Summary";

export interface SummaryGateway {
  create(Summary: Summary): Promise<Summary>;
  update(Summary: Summary): Promise<Summary>;
  findById(id: string): Promise<Summary | null>;
  findByTopic(topicId: string): Promise<Summary | null>;
  complete(id: string): Promise<Summary>;
  deactivate(id: string): Promise<Summary>;
}
