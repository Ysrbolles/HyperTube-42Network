var nodemailer = require('nodemailer');

function resetMailMsg(token, username) {
    var resetMail = 'Hi ' + username + ' click this link to reset your account\' password <a href=\"http://localhost:8080/resetpassword?token=' + token+'\">clique ici</a>' ;

    return (resetMail)
}

function msgcompose(token, username) {
    var verifMail = 'Hi ' + username + ' click this link to validate your account <a href=\"http://localhost:8080/validation?token=' + token+'\">clique ici</a>';

    return verifMail;
}

function sendVerifMail(link, name, email) {
    var msg = msgcompose(link, name);
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'aallali.online@gmail.com',
            pass: 'Blackflour99+'
        }
    });

    var mailOptions = {
        from: '1337 hyperTube',
        to: email,
        subject: 'VERIFICATION mail (hyperTube)',
        html: msg

    };

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}



function sendRestMail(email, token, username) {
    var msg = resetMailMsg(token, username)
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'aallali.online@gmail.com',
            pass: 'Blackflour99+'
        }
    });

    var mailOptions = {
        from: '1337 hyperTube',
        to: email,
        subject: 'RESET PASSWORD (hyperTube)',
        html: msg

    };

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}
module.exports.Verif = sendVerifMail;
module.exports.Reset = sendRestMail;