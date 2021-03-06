const nodemailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice');
const htmlToText = require('html-to-text');
const promisify = require('es6-promisify');

const transport = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

const generateHTML = (filename, options = {}) => {
  const html = pug.renderFile(
    `${__dirname}/../views/email/${filename}.pug`,
    options
  );
  const inline = juice(html);
  return inline;
};

exports.send = async options => {
  const html = generateHTML(options.filename, options);
  const text = htmlToText.fromString(html);

  //console.log(options.to);
  const mailOptions = {
    from: `Rodrigo Avila <rodrigo398@gmail.com>`,
    to: options.to,
    subject: options.subject,
    html,
    text
  };
  const senMail = promisify(transport.sendMail, transport);
  return senMail(mailOptions);
};

/* transport.sendMail({
  from: 'rodrix <rodrigo398@gmail.com>',
  to: 'jakas <jakasrodrix@gmail.com>',
  subject: 'test',
  html: 'hey test',
  text: 'test text'
}); */
