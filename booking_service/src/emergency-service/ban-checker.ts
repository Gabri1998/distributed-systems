/* TODO
Functionality: There may be users who take advantage of this system to be prioritized to see the dentists.
Therefore, if the user is blacklisted by the admin, this filter is going to return an automatic decline of request.
**/
import UserSchema from "../schemas/users";

async function getUserById(userId) {
  try {
    const user = await UserSchema.findOne({ id: userId });
    return user;
  } catch (err) {
    console.error("Error finding user: ", err);
    throw err;
  }
}

export async function checkBlackList(userId) {
  try {
    const user = await getUserById(userId);

    if (user && user.blackList) {
      console.log(
        "Black listed customer. Forbidden to use emergency booking system."
      );
      return false;
    } else {
      console.log(
        "Not on blacklist. Welcome to use our emergency booking system."
      );
      return true;
    }
  } catch (err) {
    console.error("Error checking blacklist: ", err);
    throw err;
  }
}
