import { Api } from './api'

export const getNotifications = async () => {
  const response = await Api().get('notification')

  return response.data
}

export const readNotification = async (notification_id) => {
  const response = await Api().get(`notification/read/${notification_id}`)

  return response.data
}

export const getUserNotifications = async (offset, limit) => {
  // should respond with an array of notifications and the total number of notifications
  const response = await Api().get(`notification?offset=${offset}&limit=${limit}`)

  return response.data
}