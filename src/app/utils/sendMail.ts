import nodemailer from 'nodemailer';
import config from '../../config';

type TEmailBody = {
  email: string;
  subject: string;
  html: string;
};

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: config.smtp_username,
    pass: config.smtp_password,
  },
});

// async..await is not allowed in global scope, must use a wrapper
const sendMail = async (emailBody: TEmailBody) => {
  const info = await transporter.sendMail({
    from: config.smtp_username,
    to: emailBody.email,
    subject: emailBody.subject,
    html: emailBody.html,
  });

  console.log('Message sent: %s', info.messageId);
};

export default sendMail;
