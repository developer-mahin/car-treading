export type TOTP = {
  sendTo: string;
  receiverType: string;
  purpose: 'email-verification' | 'forget-password';
  otp: string;
  expiredAt: Date;
  verifiedAt: Date;
  status: 'verified' | 'pending' | 'expired';
};
