class MailSender {
  constructor(to, sub, msg) {
    this.mailfrom = "captureit@gmail.com";
    this.tomail = to;
    this.sub = sub;
    this.message = msg;
    this.nodemailer = require("nodemailer");
    this.gmail = this.nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "bisratdagne99@gmail.com",
        pass: "jodx umhp zqwk rjuh",
      },
    });
    console.log("Mail obj created");
  }

  send() {
    console.log("sending mail");
    var mailOptions = {
      from: this.mailfrom,
      to: this.tomail,
      subject: this.sub,
      html: this.message,
    };

    this.gmail.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  }
}

module.exports = MailSender;
