export class PushNotificationDto {
  "endpoint": string;
  "expirationTime": any;
  "keys": Keys;
}

export class Keys {
  p256dh: string;
  auth: string;
}
