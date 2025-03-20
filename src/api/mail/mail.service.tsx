import { ENV } from '@/env'
import { logger } from '@/logger'
import { createTransport } from 'nodemailer'

type MailContact = {
  name: string
  email: string
}

type SendMailParams = {
  to: MailContact
  from: MailContact
  text: string
  html: string
  subject: string
}

type SendWelcomeParams = {
  to: MailContact
  params: {
    name: string
    password: string
    loginUrl: string
  }
}

export const mailService = {
  send: async ({ from, html, text, to, subject }: SendMailParams) => {
    const transporter = createTransport({
      url: process.env.MAILER_SMTP_URL,
    })

    const info = await transporter.sendMail({
      from: { name: from.name, address: from.email },
      to: { name: to.name, address: to.email },
      html,
      text,
      subject,
    })

    logger.debug(info, 'send email info')
  },
  sendWelcome: async ({ to, params }: SendWelcomeParams) => {
    const { loginUrl, name, password } = params

    const html = `
      <div>
        <h2>${name} seja bem-vindo.</h2>
        <p>
          Seu acesso ao <strong>Foodfy</strong> está aqui.
        </p>
        <p>
          Faça seu login <a href=${loginUrl}>clicando aqui</a>.
        </p>
        <p>Essa é sua senha ${password} de acesso.</p>
      </div>
    `
    const text = `
      ${name} bem-vindo.
      Seu acesso ao Foodfyestá aqui.
      Faça seu login clicando aqui ${loginUrl}.
      Essa é sua senha ${password} de acesso
    `

    await mailService.send({
      to,
      from: { name: ENV.MAILER_FROM_NAME, email: ENV.MAILER_FROM_ADDRESS },
      html,
      text,
      subject: 'Bem-vindo ao Foodfy',
    })
  },
}
