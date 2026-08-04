import nodemailer from "nodemailer";
import crypto from "crypto";
import dns from "dns";

dns.setDefaultResultOrder("ipv4first");

const createTransporter = () => {
  return nodemailer.createTransport ({
    host: process.env.SMTP_HOST,
    port: Number (process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export const sendLoginCode = async (to: string, code: string) => {
  if (process.env.NODE_ENV === "test") return;

  const mailTranporter = createTransporter ();

  await mailTranporter.sendMail({
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

export const sendResetPasswordLink = async (to: string, token: string) => {
    if (process.env.NODE_ENV === "test") return;

    const mailTranporter = createTransporter ();

    await mailTranporter.sendMail ({
      from: process.env.EMAIL_FROM,
      to,
      subject: "Alterar senha",
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #FA5A0A; padding: 10px; border-radius: 5px; margin-bottom: 20px"; color: white>
          <h2>Shopee Supplier Calculator</h2>
          <p>Foi solicitado uma alteração de senha por este E-mail:</p>
          <p>Use o link abaixo para alterar sua senha</p>
        </div>

        <div style="font-size: 23px; font-weight: bold; letter-spacing: 4px;">
          <a href="${process.env.FRONTEND_URL}/reset-password?token=${token}">Redefinir senha</a>
        </div>

        </div style="margin-top: 20px; background-color: #4A4A4A; color: white">
          <p>O link expira em 10 minutos.</p>
          <p>Se você não solicitou a alteração da senha, ignore este email.</p>
        </div>
      `
    })
}

export const generateCode = () => {
  return crypto.randomInt (0, 1000000).toString ().padStart (6, "0");
}
