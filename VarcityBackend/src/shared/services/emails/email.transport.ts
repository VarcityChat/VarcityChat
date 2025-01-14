import { config } from '@root/config';
import { createTransport } from 'nodemailer';
import { TemplateType } from './email.interface';
import smtpTransport from 'nodemailer-smtp-transport';

type MsgResponse = 'error' | 'success';

class EmailTransport {
  private defaultTemplate(body: string): string {
    return `<div>
      ${body}
    </div>`;
  }

  private selectTemplate(template = 'default') {
    return (body: string) => {
      switch (template) {
        case 'default':
          return this.defaultTemplate(body);
        default:
          return this.defaultTemplate(body);
      }
    };
  }

  //   private async zohoSmsSender(receiverEmail: string, body: string) {}

  //   private devEmailSender(receiverEmail: string, body: string) {}

  private async prodEmailSender(
    receiverEmail: string,
    title: string,
    body: string,
    template: TemplateType
  ): Promise<MsgResponse> {
    const transport = createTransport(
      smtpTransport({
        host: config.EMAIL_HOST,
        port: Number(config.EMAIL_PORT),
        auth: {
          user: config.EMAIL_USER,
          pass: config.EMAIL_PASS
        }
      })
    );

    const mailOptions = {
      from: '"Varcity" <support@geelgeworden.nl>',
      to: receiverEmail,
      subject: title,
      text: template === 'reset-password' ? `Your Varcity Reset Password OTP is ... ${body}` : body,
      html: this.selectTemplate(template)(
        `Enter the OTP to reset your password. </br> <b>${body}</b>`
      )
    };

    try {
      await transport.sendMail(mailOptions);
      return Promise.resolve('success');
    } catch (error) {
      console.error('\n\nEMAIL ERROR:', error);
      return Promise.resolve('error');
    }
  }

  public async sendMail(
    receiverEmail: string,
    title: string,
    body: string,
    template: TemplateType = 'default'
  ): Promise<MsgResponse> {
    return this.prodEmailSender(receiverEmail, title, body, template);
  }

  public async sendMailToAdmins(title: string, body: string) {
    const adminEmails = ['promisesheggs@gmail.com'];
    for (const email of adminEmails) {
      this.prodEmailSender(email, title, body, 'default');
    }
  }
}

export const emailTransport: EmailTransport = new EmailTransport();
