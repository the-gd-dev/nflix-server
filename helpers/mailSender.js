const nodemailer = require("nodemailer");
const { basePath } = require("../paths");
const pug = require("pug");

class mailSender {
  constructor(to, subject, templateFileName, templateData) {
    this.to = to;
    this.subject = subject;
    this.templateFileName = templateFileName;
    this.templateData = templateData;
  }
  _createTransport() {
    return nodemailer.createTransport({
      mailer: process.env.MAIL_MAILER,
      tls: process.env.MAIL_ENCRYPTION === "tls",
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: false,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });
  }
  async generateHTML() {
    return await pug.renderFile(
      basePath + "/views/emails/" + this.templateFileName + ".pug",
      this.templateData
    );
  }
  async send() {
    const htmlString = await this.generateHTML();
    const transporter = this._createTransport();
    transporter.sendMail({
      from: "Netlix Clone Support <support@netflixclone.io>",
      to: this.to,
      subject: this.subject,
      text: this.text || "",
      html: htmlString,
    });
    return {
      message: "mail sent!",
    };
  }
}
module.exports = mailSender;
