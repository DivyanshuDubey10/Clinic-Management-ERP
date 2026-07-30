import api from "./api";

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
  _id: string;
  title: string;
  message: string;
  isRead: boolean;
  type: NotificationType;
  link?: string;
  createdAt: string;
}

export interface GetNotificationsResponse {
  success: boolean;
  count: number;
  unreadCount: number;
  data: Notification[];
}

export async function getNotifications(limit: number = 50): Promise<GetNotificationsResponse> {
  const res = await api.get(`/notifications?limit=${limit}`);
  return res.data;
}

export async function markNotificationAsRead(id: string): Promise<void> {
  const res = await api.put(`/notifications/${id}/read`);
  return res.data;
}

export async function markAllNotificationsAsRead(): Promise<void> {
  const res = await api.put(`/notifications/read-all`);
  return res.data;
}
