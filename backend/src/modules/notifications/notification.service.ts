import mongoose, { Schema, Document } from 'mongoose';
import { NotificationType } from '../../common/enums';

export interface INotification extends Document {
  recipient: mongoose.Types.ObjectId;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  data?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    recipient: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(NotificationType),
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.index({ recipient: 1, read: 1 });
notificationSchema.index({ recipient: 1, createdAt: -1 });

const Notification = mongoose.model<INotification>('Notification', notificationSchema);

export class NotificationService {
  static async createNotification(data: {
    recipient: string;
    type: NotificationType;
    title: string;
    message: string;
    data?: Record<string, any>;
  }): Promise<INotification> {
    return Notification.create(data);
  }

  static async getNotifications(userId: string, page: number = 1, limit: number = 20) {
    const total = await Notification.countDocuments({ recipient: userId });
    const notifications = await Notification.find({ recipient: userId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return {
      notifications,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  static async markAsRead(notificationId: string, userId: string): Promise<INotification | null> {
    return Notification.findOneAndUpdate(
      { _id: notificationId, recipient: userId },
      { read: true },
      { new: true }
    );
  }

  static async markAllAsRead(userId: string): Promise<void> {
    await Notification.updateMany({ recipient: userId, read: false }, { read: true });
  }

  static async getUnreadCount(userId: string): Promise<number> {
    return Notification.countDocuments({ recipient: userId, read: false });
  }

  static async deleteNotification(notificationId: string, userId: string): Promise<void> {
    await Notification.findOneAndDelete({ _id: notificationId, recipient: userId });
  }
}

export default NotificationService;
