// Entity
import { Topic } from "../../entity/topic/Topic";

export interface TopicGateway {
  create(topic: Topic): Promise<void>;
  findById(id: string): Promise<Topic | null>;
  findByName(idJourney: string, topicName: string): Promise<Topic[]>;
  listAll(idJourney: string): Promise<Topic[]>;
  complete(id: string): Promise<void>;
  deactivate(id: string): Promise<void>;
  updateName(id: string, newName: string): Promise<void>;
}
