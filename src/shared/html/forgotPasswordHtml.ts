import { style } from '../style/style';

export const forgotPasswordHtml = (title: string, otp: number) => {
  return `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <style>
    ${style}
    </style>
  </head>
   <body>
    <div class="preheader">
      Reset your password for your CAT-TREADING account.
    </div>
    <div class="email-container">
      <!-- Header -->
      <div class="email-header">
        <img src="https://image.similarpng.com/file/similarpng/very-thumbnail/2020/05/Solutions-website-logo-png.png" alt="The CAT-TREADING Logo" />
        <h1>Reset Your Password</h1>
      </div>
      <!-- Content -->
      <div class="email-content">
        <h2>Hello!</h2>
        <p>
          We received a request to reset the password for your <strong>CAT-TREADING</strong> account.
          If you did not make this request, you can safely ignore this email.
        </p>
        <p>Please use the One Time Password (OTP) below to proceed:</p>
        <span class="otp-code">${otp}</span>
        <p>
          If you have any trouble resetting your password, please contact us at 
          <a href="mailto:support@localmargin.com">support@localmargin.com</a>.
        </p>
        <p>
          Sincerely,<br />
          The <strong>CAT-TREADING</strong> Team
        </p>
      </div>
      <!-- Footer -->
      <div class="email-footer">
        &copy; ${new Date().getFullYear()} <strong>CAT-TREADING</strong>. All rights reserved.
      </div>
    </div>
  </body>
</html>
`;
};
