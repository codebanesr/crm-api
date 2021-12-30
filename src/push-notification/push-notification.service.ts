import { Injectable, Logger } from "@nestjs/common";
import config from "../config/config";

import {
  sendNotification,
  setVapidDetails,
  RequestOptions,
  PushSubscription,
  SendResult,
} from "web-push";

@Injectable()
export class PushNotificationService {
  constructor() {
    setVapidDetails(
      "mailto:example@yourdomain.org",
      config.webpush.VAPID_PUBLIC,
      config.webpush.VAPID_PRIVATE
    );
  }

  async sendPushNotification(
    subscription: PushSubscription,
    payload?: string | Buffer | null | Record<string, any>,
    options?: RequestOptions
  ): Promise<SendResult> {
    Logger.debug(payload);
    return sendNotification(subscription, JSON.stringify(payload));
  }
}
