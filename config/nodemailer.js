const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'jigrani0000@gmail.com',
        pass: 'rtpn nshs kdmo xxua'
    }
});

let renderTemplate = (data, relativePath) => {
    let mailHTML;
    ejs.renderFile(       
        path.join((__dirname, '../views/mailers',
        relativePath),
        data,
        function(template){
        mailHTML = template;
        }
        ));
    return mailHTML;    
}

module.exports = {
   transporter: transporter,
   renderTemplate: renderTemplate, 
}

