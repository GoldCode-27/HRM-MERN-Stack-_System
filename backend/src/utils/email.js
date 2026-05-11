const nodemailer = require('nodemailer');

const { EMAIL_USER, EMAIL_PASS, EMAIL_FROM } = process.env;

const createTransporter = () => {
  if (!EMAIL_USER || !EMAIL_PASS) {
    console.warn('EMAIL_USER and EMAIL_PASS are not configured. Email sending will be disabled.');
    return null;
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });

  transporter.verify((error) => {
    if (error) {
      console.warn('Email transporter verification failed:', error.message);
    } else {
      console.log('Email transporter is ready');
    }
  });

  return transporter;
};

const transporter = createTransporter();

const sendEmail = async ({ to, subject, text, html }) => {
  if (!transporter) {
    console.warn('Skipping email send because transporter is not configured. to=', to, 'subject=', subject);
    return;
  }

  try {
    await transporter.sendMail({
      from: EMAIL_FROM || EMAIL_USER,
      to,
      subject,
      text,
      html,
    });
  } catch (error) {
    console.warn('Email send failed:', error.message);
  }
};

module.exports = { sendEmail };

module.exports = { sendEmail };
