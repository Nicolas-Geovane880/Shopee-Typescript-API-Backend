import nodemailer from "nodemailer";
import crypto from "crypto";

export const mailTransport = nodemailer.createTransport ({
  host: process.env.SMTP_HOST,
  port: Number (process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendLoginCode = async (to: string, code: string) => {
   await mailTransport.sendMail({
    from: process.env.EMAIL_FROM,
    to: to,
    subject: "Seu código de verificação",
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #FA5A0A; padding: 10px; border-radius: 12px; margin-bottom: 20px"; color: white>
        <h2>Shopee Supplier Calculator</h2>
        <p>Use o código abaixo para concluir seu login:</p>
      </div>

      <div style="font-size: 28px; font-weight: bold; letter-spacing: 4px;">
        ${code}
      </div>
      </div style="margin-top: 20px; background-color: #4A4A4A; color: white">
        <p>Esse código expira em 5 minutos.</p>
        <p>Se você não tentou fazer login, ignore este email.</p>
      </div>
    `,
  });
}

export const generateCode = () => {
  return crypto.randomInt (0, 1000000).toString ().padStart (6, "0");
}
