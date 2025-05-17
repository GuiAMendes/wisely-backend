// Entity
import { Journey } from "../entity";

export interface JourneyGateway {
  create(journey: Journey): Promise<Journey>;
  update(journey: Journey): Promise<Journey>;
  findById(id: string): Promise<Journey | null>;
  findByName(journeyName: string): Promise<Journey[]>;
  listAll(idDirectory: string): Promise<Journey[]>;
  listRecentAccess(idDirectory: string): Promise<Journey[]>;
  complete(id: string): Promise<Journey>;
  deactivate(id: string): Promise<Journey>;
}
