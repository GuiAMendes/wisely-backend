// Entity
import { Topic } from "../entity";

export interface TopicGateway {
  create(topic: Topic): Promise<Topic>;
  update(topic: Topic): Promise<Topic>;
  findById(id: string): Promise<Topic | null>;
  findByName(topicName: string): Promise<Topic[]>;
  listAll(idJourney: string, idUser: string): Promise<Topic[]>;
  complete(id: string): Promise<Topic>;
  deactivate(id: string): Promise<Topic>;
}
