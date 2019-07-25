const express = require('express');
const router = express.Router();
const User = require('../models/User');
const alertMessage = require('../helpers/messenger');
var bcrypt = require('bcryptjs');
const passport = require('passport');
// SendGrid
const sgMail = require('@sendgrid/mail');
// JWT
const jwt = require('jsonwebtoken');


function sendEmail(userId, email, token) {
    sgMail.setApiKey("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");

    const message = {
        to: email,
        from: 'Do Not Reply <admin@video-jotter.sg>',
        subject: 'Verify Video Jotter Account',
        text: 'Video Jotter Email Verification',
        html: `Thank you registering with Video Jotter.<br><br>
    Please <a href="http://localhost:5000/user/verify/${userId}/${token}">
    <strong>verify</strong></a>your account.`
    };
    // Returns the promise from SendGrid to the calling function
    return new Promise((resolve, reject) => {
        sgMail.send(message)
            .then(msg => resolve(msg))
            .catch(err => reject(err));
    })
}

// Login Form POST => /user/login
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/video/listVideos', // Route to /video/listVideos URL
        failureRedirect: '/showLogin', // Route to /login URL
        failureFlash: true
        /* Setting the failureFlash option to true instructs Passport to flash an error
        message using the message given by the strategy's verify callback, if any.
        When a failure occur passport passes the message object as error */
    })(req, res, next);
});


// User register URL using HTTP post => /user/register
router.post('/register', (req, res) => {

    let errors = [];
    // Retrieves fields from register page from request body
    let { name, email, password, password2 } = req.body;

    // Checks if both passwords entered are the same
    if (password !== password2) {
        errors.push({ text: 'Passwords do not match' });
    }

    // Checks that password length is more than 4
    if (password.length < 4) {
        errors.push({ text: 'Password must be at least 4 characters' });
    }
    if (errors.length > 0) {
        res.render('user/register', {
            errors,
            name,
            email,
            password,
            password2
        });
    } else {
        // If all is well, checks if user is already registered
        User.findOne({ where: { email: req.body.email } })
            .then(user => {
                if (user) {
                    // If user is found, that means email has already been
                    // registered
                    res.render('user/register', {
                        error: user.email + ' already registered',
                        name,
                        email,
                        password,
                        password2
                    });
                } else {
                    // Generate JWT token
                    let token;
                    jwt.sign(email, 's3cr3Tk3y', (err, jwtoken) => {
                        if (err) console.log('Error generating Token: ' + err);
                        token = jwtoken;
                    });
                    // Encrypt the password
                    var salt = bcrypt.genSaltSync(10);
                    var hashedPassword = bcrypt.hashSync(password, salt);
                    password = hashedPassword;

                    // Create new user record
                    // Create new user record
                    User.create({
                        name,
                        email,
                        password,
                        verified: 0, // Add this statement – set verify to false
                    }).then(user => { // Send email after user is inserted into DB
                        sendEmail(user.id, user.email, token) // Add this to call sendEmail function
                            .then(msg => { // Send email success
                                alertMessage(res, 'success', user.name + ' added. Please logon to ' +
                                    user.email + ' to verify account.',
                                    'fas fa-sign-in-alt', true);
                                res.redirect('/showLogin');
                            }).catch(err => { // Send email fail
                                alertMessage(res, 'warning', 'Error sending to ' + user.email,
                                    'fas fa-sign-in-alt', true);
                                res.redirect('/');
                            });
                    }).catch(err => console.log(err));

                }
            });
    }
});


router.post('/register', (req, res) => {
    req.logout();
    res.redirect('/');
});

router.get('/', (req, res) => {
    const title = 'I\'m at the user router!';
    res.render('index', { title: title }) // renders views/index.handlebars
});

router.get('/verify/:userId/:token', (req, res, next) => {
    // retrieve from user using id
    User.findOne({
        where: {
            id: req.params.userId
        }
    }).then(user => {
        if (user) { // If user is found
            let userEmail = user.email; // Store email in temporary variable
            if (user.verified === true) { // Checks if user has been verified
                alertMessage(res, 'info', 'User already verified', 'fas fa-exclamation-circle', true);
                res.redirect('/showLogin');
            } else {
                // Verify JWT token sent via URL
                jwt.verify(req.params.token, 's3cr3Tk3y', (err, authData) => {
                    if (err) {
                        alertMessage(res, 'danger', 'Unauthorised Access', 'fas fa-exclamation-circle', true);
                        res.redirect('/');
                    } else {
                        User.update({ verified: 1 }, {
                            where: { id: user.id }
                        }).then(user => {
                            alertMessage(res, 'success', userEmail + ' verified.Please login', 'fas fa-sign-in-alt', true);
                            res.redirect('/showLogin');
                        });
                    }
                });
            }
        } else {
            alertMessage(res, 'danger', 'Unauthorised Access', 'fas fa-exclamation-circle', true);
            res.redirect('/');
        }
    });
});



module.exports = router;
