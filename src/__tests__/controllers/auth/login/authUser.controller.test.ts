import { createUserControllers } from "../../../../factories/userFactory";
import { Request, Response } from "express";
import { prisma } from "../../../../shared/factory/sharedFactory";

describe("AuthUserController", () => {
  it("Should create a new token successfully", async () => {
    const [authUser, createUser] = createUserControllers();

    const json = jest.fn();
    const status = jest.fn(() => ({ json }));

    const email = `dummy.${Date.now()}@example.com.br`;
    const password = "DummyW@rd0310";
    const username = `dummy_user_${Date.now()}`;

    await createUser.getHandler()(
      {
        body: { username, email, password },
      } as Request,
      {
        status,
      } as unknown as Response
    );

    json.mockClear();
    status.mockClear();

    const req = {
      body: { email, password },
    } as Request;

    const res = {
      status,
    } as unknown as Response;

    const handler = authUser.getHandler();
    await handler(req, res);

    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        token: expect.any(String),
      })
    );

    await prisma.user.delete({
      where: {
        email,
      },
    });
  });
});
