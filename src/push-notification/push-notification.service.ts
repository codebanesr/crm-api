import { Injectable, Logger } from "@nestjs/common";

import {
  sendNotification,
  setVapidDetails,
  RequestOptions,
  PushSubscription,
  SendResult,
} from "web-push";
import AppConfig from "../config";

@Injectable()
export class PushNotificationService {
  constructor() {
    setVapidDetails(
      "mailto:example@yourdomain.org",
      AppConfig.webpush.VAPID_PUBLIC,
      AppConfig.webpush.VAPID_PRIVATE
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
