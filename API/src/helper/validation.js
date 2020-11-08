const _ = require('lodash');

function validname(name) {
    if(name){
        if (/^([a-zA-Z0-9]+|[a-zA-Z0-9]+\s{1}[a-zA-Z0-9]{1,}|[a-zA-Z0-9]+\s{1}[a-zA-Z0-9]{3,}\s{1}[a-zA-Z0-9]{1,})$/.test(name) && name.length >= 3 && name.length <= 20) {
            return (true)
        } else {
            return false
        }
    } else
    return false

}

function validBio(bio) {
    if (typeof bio === 'undefined')
        return false;
    if (/^[a-zA-Z0-9,.!? ]+$/.test(bio) && bio.length >= 20 && bio.length <= 300) {
        return (true)
    } else {
        return false
    }
}

function ValidateUsername(user) {
    if (/^[A-Za-z0-9]+$/.test(user) && user.length >= 3 && user.length <= 15) {
        return (true)
    } else {
        return false
    }
}

function ValidateEmail(mail) {
    if (typeof mail == 'undefined')
        return (false)
    else if (typeof mail == 'string') {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail.trim())) {
            return (true)
        } else {
            return false
        }
    } else
        return false
}

function ValidateAge(age) {
    if (isNaN(age) || age === 'undefined')
        return false;
    else if (parseInt(age) < 16 || parseInt(age) > 100)
        return false;
    else
        return true;

}

function ValidateGender(gender) {
    if (isNaN(gender) || gender === 'undefined')
        return false;
    else if (parseInt(gender) != 0 && parseInt(gender) != 1)
        return false;
    else
        return true;

}

function ValidAge(age) {
    if (typeof age === 'undefined')
        return false
    else if (/^[0-9]+$/.test(age) && parseInt(age) > 15 && parseInt(age) < 101)
        return true
    else
        return false

}

function ValidatePass(pass) {
    if (/((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,20}))/.test(pass)) {
        return (true)
    } else {
        return false
    }
}

function ValidateToken(token) {
    if (/^[A-Za-z0-9]+$/.test(token) && token.length > 8 && token.length < 100) {
        return (true)
    } else {
        return false
    }
}

function isString(data) {
    if (typeof data === 'string')
        if (data.length != 0)
            return true;
        else {
            return false
        }

}

function isDefined(fname, lname, email, username, password, age, gender, city) {

    if (isString(fname) && isString(lname) && isString(email) && isString(username) && isString(password) && isString(age) && !isNaN(age) && isString(gender) && isString(city)) {
        if (!ValidateEmail(email.trim()) || !ValidatePass(password.trim()) || !validname(fname.trim()) || !validname(lname.trim()) || !ValidateAge(age.trim()) || !ValidateGender(gender.trim()) || !ValidateUsername(username.trim()))
            return false;
        else
            return true;
    } else
        return false;
}

function validComment(comment)
{
    return ((/^[a-zA-Z 0-9]+$/.test(comment)) && comment.length <= 300);
}

function validFilmId(id)
{
    return (/^[a-z0-9]+$/.test(id));
}

module.exports.isDefined = isDefined;
module.exports.Name = validname;
module.exports.User = ValidateUsername;
module.exports.Email = ValidateEmail;
module.exports.Pass = ValidatePass;
module.exports.Token = ValidateToken;

module.exports.Comment = validComment;
module.exports.Film = validFilmId;

module.exports.Age = ValidAge;
module.exports.Gender = ValidateGender;

module.exports.Bio = validBio;