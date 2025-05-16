import { PrismaClient } from "../../../../generated/prisma";

export class Prisma {
  private static instance: PrismaClient;

  private constructor() {}

  public static getInstance() {
    if (this.instance == null) this.instance = new PrismaClient();
    return this.instance;
  }
}
