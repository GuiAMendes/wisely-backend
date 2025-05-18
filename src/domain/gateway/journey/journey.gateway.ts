// Entity
import { Journey } from "../../entity/journey/Journey";

export interface JourneyGateway {
  create(journey: Journey): Promise<void>;
  update(journey: Journey): Promise<void>;
  findById(id: string): Promise<Journey | null>;
  findByName(journeyName: string): Promise<Journey[]>;
  listAll(idDirectory: string): Promise<Journey[]>;
  listRecentAccess(idDirectory: string): Promise<Journey[]>;
  complete(id: string): Promise<void>;
  deactivate(id: string): Promise<void>;
}
