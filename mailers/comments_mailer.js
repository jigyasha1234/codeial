const nodeMailer = require('../config/nodemailer');

exports.newComment = (comment) => {
    console.log('inside newcomment mailer:', comment.user.email);


    nodeMailer.transporter.sendMail({
        from: 'jigrani0000@gmail.com',
        to: comment.user.email,
        subject: "New comment published!",
        html: '<h1>Yup, your comment is now published!</h1>'
    }, (err, info) =>
    {
        if(err)
        {
            console.log('Error in sending mail', err);
            return;
        }
        console.log('Message sent', info);
        return;
    })
}