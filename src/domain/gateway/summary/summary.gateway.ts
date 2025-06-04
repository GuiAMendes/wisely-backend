// Entity
import { Summary } from "../../entity/summary/Summary";

export interface SummaryGateway {
  create(summary: Summary): Promise<void>;
  findById(id: string): Promise<Summary | null>;
  findByTopic(topicId: string): Promise<Summary | null>;
  updateTitle(id: string, newTitle: string): Promise<void>;
  updateContent(id: string, newContent: string): Promise<void>;
  deactivate(id: string): Promise<void>;
}
