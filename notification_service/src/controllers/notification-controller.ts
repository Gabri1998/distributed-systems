import notificationSchema, { Notification } from "../schemas/notification";
import { MessageException } from "../exceptions/MessageException";
import { MessageHandler, RequestInfo } from "../utilities/types-utils";


export const pushNotification: MessageHandler = async (data, requestInfo) => {


  const { user_id, note, type } = data;

  if (!user_id || !note || !type) {
    throw new MessageException({
      code: 422,
      message: "missing data, All data are required to be provided.",
    });
  }

  const newNotification = new notificationSchema({
    user_id,
    note,
    type,
    readByUser: false,
  });

  await newNotification.save();
  return newNotification;
};

export const getNotification: MessageHandler = async (data, requestInfo) => {
  const user_id = requestInfo.user?.id;

  let offset = requestInfo.query?.offset;
  let limit = requestInfo.query?.limit;

  if (typeof offset !== 'number') {
    offset = 0; // default value if offset is undefined
  }

  if (typeof limit !== 'number') {
    limit = 10; // default value if limit is undefined
  }

  // Check if offset and limit are valid integers
  if (!isNaN(offset) && !isNaN(limit) && offset >= 0 && limit > 0) {
    const paginatedNotifications = await notificationSchema
      .find({ user_id })
      .skip(offset)
      .limit(limit);
    return paginatedNotifications;
  } else {
    // Return all notifications if offset and limit are not provided
    const allNotification = await notificationSchema.find({ user_id });
    return allNotification;
  }
};

export const readByUser: MessageHandler = async (data, requestInfo) => {
  const user_id = requestInfo.user?.id;
  const { id } = data;

  if (!id) {
    throw new MessageException({
      code: 422,
      message: "missing data, All data are required to be provided.",
    });
  }

  const notification = await notificationSchema.findOne({ _id: id });

  if (!notification) {
    throw new MessageException({
      code: 404,
      message: "Notification not found",
    });
  }

  if (notification.user_id !== user_id) {
    throw new MessageException({
      code: 403,
      message: "You are not allowed to read this notification",
    });
  }

  notification.readByUser = true;
  await notification.save();
  return notification;
};

export default { pushNotification, getNotification, readByUser };
