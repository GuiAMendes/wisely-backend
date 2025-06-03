import { createUserControllers } from "../../../../factories/userFactory";
import { Request, Response } from "express";

describe("CreateUserController", () => {
  it("Should create a new user successfully", async () => {
    const [, createUser] = createUserControllers();
    const json = jest.fn();
    const status = jest.fn(() => ({ json }));

    const req = {
      body: {
        username: "Edward Elric",
        email: `edward.elric${Date.now()}@example.com.br`,
        password: "EdW@rd0310",
      },
    } as Request;

    const res = {
      status,
    } as unknown as Response;

    const handler = createUser.getHandler();

    await handler(req, res);

    expect(status).toHaveBeenCalledWith(201);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        id: expect.any(String),
      })
    );
  });
});