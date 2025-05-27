// Entity
import { Journey } from "../../entity/journey/Journey";

export interface JourneyGateway {
  create(journey: Journey): Promise<void>;
  findById(id: string): Promise<Journey | null>;
  findByName(idDirectory: string, journeyName: string): Promise<Journey[]>;
  listAll(idDirectory: string): Promise<Journey[]>;
  listRecentAccess(idDirectory: string): Promise<Journey[]>;
  updateName(id: string, newName: string): Promise<void>;
  updateDateOfAccess(id: string): Promise<void>;
  complete(id: string): Promise<void>;
  deactivate(id: string): Promise<void>;
}
