"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailTransport = void 0;
const config_1 = require("../../../config");
const nodemailer_1 = require("nodemailer");
class EmailTransport {
    defaultTemplate(body) {
        return `<div>
      ${body}
    </div>`;
    }
    selectTemplate(template = 'default') {
        return (body) => {
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
    async prodEmailSender(receiverEmail, title, body, template) {
        const transport = (0, nodemailer_1.createTransport)({
            host: config_1.config.EMAIL_HOST,
            port: parseInt(`${config_1.config.EMAIL_PORT}`),
            auth: {
                user: config_1.config.EMAIL_USER,
                pass: config_1.config.EMAIL_PASS
            }
        });
        const mailOptions = {
            from: '"Varcity" <support@geelgeworden.nl>',
            to: receiverEmail,
            subject: title,
            text: template === 'reset-password' ? `Your Varcity Reset Password OTP is ... ${body}` : body,
            html: this.selectTemplate(template)(`Enter the OTP to reset your password. </br> <b>${body}</b>`)
        };
        try {
            await transport.sendMail(mailOptions);
            return Promise.resolve('success');
        }
        catch (error) {
            console.error('\n\nEMAIL ERROR:', error);
            return Promise.resolve('error');
        }
    }
    async sendMail(receiverEmail, title, body, template = 'default') {
        return this.prodEmailSender(receiverEmail, title, body, template);
    }
    async sendMailToAdmins(title, body) {
        const adminEmails = ['promisesheggs@gmail.com'];
        for (const email of adminEmails) {
            this.prodEmailSender(email, title, body, 'default');
        }
    }
}
exports.emailTransport = new EmailTransport();
//# sourceMappingURL=email.transport.js.map