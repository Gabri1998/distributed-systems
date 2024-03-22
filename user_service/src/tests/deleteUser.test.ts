import { deleteUser } from "../controllers/users-controller";
import { MessageException } from "../exceptions/MessageException";
import UserSchema from "../schemas/users";

jest.mock("../schemas/users");

describe("deleteUser function", () => {
  it("should return Invalid id when wrong userID", async () => {
    const mockUserId = "userId";

    const findByIdSpy = jest.spyOn(UserSchema, "findById");
    findByIdSpy.mockResolvedValueOnce(null);

    await expect(
      deleteUser({ user_id: mockUserId }, {} as any)
    ).rejects.toThrow(
      new MessageException({
        code: 400,
        message: "Invalid id",
      })
    );

    findByIdSpy.mockRestore();
  });
});
