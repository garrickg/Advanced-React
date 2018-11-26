const nodemailer = require('nodemailer');

const {
  MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASS,
} = process.env;
const transport = nodemailer.createTransport({
  host: MAIL_HOST,
  port: MAIL_PORT,
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASS,
  },
});

const makeANiceEmail = text => `
  <div className="email" style="
    border: 1px solid black;
    padding: 20px;
    font-family: sans-sarif;
    line-height: 2;
    font-size: 20px;
  ">
    <h2>Hello there!</h2>
    <p>${text}</p>
    <p>Regards,</p>
    <p>Garrick</p>
  </div>
`;

exports.transport = transport;
exports.makeANiceEmail = makeANiceEmail;
