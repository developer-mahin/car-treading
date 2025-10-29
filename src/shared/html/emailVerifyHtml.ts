import { style } from '../style/style';

export const emailVerifyHtml = (
  title: string,
  otp: number,
  expiresIn: string = '3 minutes',
) => {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <style type="text/css">
      ${style}
    </style>
  </head>
  <body>
    <div class="preheader">
      Verify your email address to complete your registration.
    </div>
    <div class="email-container">
      <!-- Header -->
      <div class="email-header">
        <img
          src="https://image.similarpng.com/file/similarpng/very-thumbnail/2020/05/Solutions-website-logo-png.png"
          alt="The Car Treading Logo"
        />
        <h1>Email Verification</h1>
      </div>
      <!-- Content -->
      <div class="email-content">
        <h2>Hello!</h2>
        <p>
          Thank you for signing up with The Car Treading. Please verify your
          email address by using the One Time Password (OTP) below:
        </p>
        <span class="otp-code">${otp}</span>
        <p>
          This OTP is valid for <strong>${expiresIn}</strong>. If you did not
          request this, please ignore this email or contact our support.
        </p>
        <p style="text-align: center">
          <a href="mailto:support@thelocalmargin.com" class="btn"
            >Contact Support</a
          >
        </p>
        <p>Best regards,<br />The Car Treading Team</p>
      </div>
      <!-- Footer -->
      <div class="email-footer">
        &copy; ${new Date().getFullYear()} The Car Treading. All rights
        reserved.
      </div>
    </div>
  </body>
</html>

`;
};
