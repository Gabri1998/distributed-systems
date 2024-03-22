import { getUser } from "../controllers/users-controller";
import { MessageException } from "../exceptions/MessageException";
import UserSchema from "../schemas/users";

jest.mock("../schemas/users");

describe("getUser function", () => {
  it("should return user if found", async () => {
    const mockUserId = "userid";
    const mockUser = { _id: mockUserId, name: "David Hong" };

    // Mocking the findById method
    const findByIdSpy = jest.spyOn(UserSchema, "findById");
    findByIdSpy.mockResolvedValueOnce(mockUser);

    const result = await getUser({ user_id: mockUserId }, {} as any);

    expect(result).toEqual(mockUser);

    // Clean up the spy
    findByIdSpy.mockRestore();
  });

  it("should return Invalid user ID when wrong userID", async () => {
    const mockUserId = "userId";

    const findByIdSpy = jest.spyOn(UserSchema, "findById");
    findByIdSpy.mockResolvedValueOnce(null);

    await expect(getUser({ user_id: mockUserId }, {} as any)).rejects.toThrow(
      new MessageException({
        code: 400,
        message: "Invalid user ID",
      })
    );

    findByIdSpy.mockRestore();
  });
});
