const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Quiz = require('../models/Quiz');
const alertMessage = require('../helpers/messenger');
var bcrypt = require('bcryptjs');
const passport = require('passport');
// SendGrid
const sgMail = require('@sendgrid/mail');
// JWT
const jwt = require('jsonwebtoken');


// Login&Signup Form POST => /user/LoginSignUp
router.post('/LoginSignUp', (req, res, next) => {
    //passport.authenticate('local', {
    //    successRedirect: '/quiz', // Route to /video/listVideos URL
    //    failureRedirect: '/LoginSignUp', // Route to /login URL
    //    failureFlash: true
    /* Setting the failureFlash option to true instructs Passport to flash an error
    message using the message given by the strategy's verify callback, if any.
    When a failure occur passport passes the message object as error */
    //})(req, res, next);

    let errors = [];
    // Retrieves fields from register page from request body
    let { email, password, weight, height } = req.body;

    // Signup
    if (errors.length > 0) {
        res.render('user/LoginSignUp', {
            errors
        });
    } else {
        // If all is well, checks if user is already registered
        User.findOne({ where: { email: req.body.email } })
            .then(user => {
                if (user) { 
                    // If user is found, that means email has already been registered
                    res.render('user/LoginSignUp', {
                        error: user.email + ' already registered'
                    });
                }
                else {
                    // Encrypt the password
                    let token;
                    var salt = bcrypt.genSaltSync(10);
                    var hashedPassword = bcrypt.hashSync(password, salt);
                    password = hashedPassword;

                    jwt.sign(email, hashedPassword, (err, jwtoken) => {
                        if (err) {
                            console.log('Error generating Token: ' + err);
                        }
                        token = jwtoken;
                    });

                    // Create new user record
                    User.create({ email, password, weight, height, verified: 0 })
                        .then(user => {
                            sendEmail(user.id, user.email, token)
                            console.log("User created");
                            alertMessage(res, 'success', user.email + ' added. Please login to ' +
                                user.email + ' to verify account.',
                                'fas fa-sign-in-alt', true);
                            res.redirect('/LoginSignUp');
                        })
                        .catch(err => console.log(err));
                }
        });
    }
});


// Practical 11 Activity 04
function sendEmail(userId, email, token) {
    sgMail.setApiKey('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'); // <Insert your SendGrid API key here>

    const message = {
        to: email,
        from: 'Do Not Reply <admin@gmail.com>',
        subject: 'Verify Email Account',
        text: 'Email Verification',
        html: `Thank you for registering with Us.<br><br>
    Please click <a href="http://localhost:5000/user/verify/${userId}/${token}">
    <strong> here</strong></a> to verify your account.`
    };
    // Returns the promise from SendGrid to the calling function
    return new Promise((resolve, reject) => {
        sgMail.send(message)
            .then(msg =>
                resolve(msg)).catch(err =>
                    reject(err)
                );
    });
}

router.post('', (req, res) => {
    req.logout();
    res.redirect('/');
});

// router.post('/index', (req, res, next) => {   
//     User.findOne({
//         where: {
//             email: req.body.email
//         }
//     }).then(user => {

//         let errors = [];
//         if (user) {
//             if (user.verified === false) {
//                 // user is not yet verified
//                 errors.push({ text: "User is not yet verified." });
//                 res.redirect('/LoginSignUp');
//             } 
//         } else {
//             // No user with the input email is found
//             errors.push({ text: 'No user with the input email is found!' });
//             res.redirect('/LoginSignUp');
//         }
//         if (errors.length > 0) {
//             email = req.body.email; // Store the Email
//             password = req.body.password; // Store the Password
//             // alertMessage(res, 'danger', 'Account is not yet verified. Please verify the account before logging in.', 'fas fa-ban', true);
//             res.render('user/LoginSignUp', {
//                 errors, // Show the error
//                 email, // Populate the email so that user does not need to re-enter the details
//                 password, // Populate the email so that user does not need to re-enter the password
//             })
//         }
//     }).catch(err => {
//         console.log(err)
//     });
//     res.render('/index'); // need change the routing after combine
// });

// List user data, not working
router.get('/Useradmin', (req, res) => {
	User.findAll({
		raw: true
	})
	.then((user) => {
		res.render('user/Useradmin', {
			user
		});
	})
	.catch(err => console.log(err)); // renders views/user/DragnDrop.handlebars
});

router.post('/addQuiz', (req, res, next) => {

    let question = req.body.question;
    let choiceA = req.body.choiceA;
    let choiceB = req.body.choiceB;
    let choiceC = req.body.choiceC;   
    let correct = req.body.correct;
    // let userId = req.user.id;

    Quiz.create({
        question,
        choiceA,
        choiceB,
        choiceC,
        correct
        // ,userId
    }).then((quizzes) => {
        res.redirect('/user/QuizData')
    })
});

router.get('/QuizData', (req, res) => {
	Quiz.findAll({
        // where: {
        //     userId: req.user.id
        // },
		raw: true
	})
	.then((quizzes) => {
		res.render('user/QuizData', {
			quizzes:quizzes
		});
	})
	.catch(err => console.log(err)); // renders views/user/DragnDrop.handlebars
});

// Shows edit video page
router.get('/edit/:id', (req, res) => {
    Quiz.findOne({
        where: {
            id: req.params.id
        }
    }).then((quizzes) => {

        if (req.user.id === quizzes.userId) {
            // call views/video/editVideo.handlebar to render the edit video page
            res.render('user/editQuiz', {
                quizzes // passes video object to handlebar
            });
        }
    }).catch(err => console.log(err)); // To catch no video ID
});

// Save edited video
router.put('/saveEditedVideo/:id', (req, res) => {
    let question = req.body.question;
    let choiceA = req.body.choiceA;
    let choiceB = req.body.choiceB;
    let choiceC = req.body.choiceC;   
    let correct = req.body.correct;
    let userId = req.user.id;
    var quizID = req.params.id;

    Quiz.update({
        question,
        choiceA,
        choiceB,
        choiceC,
        correct,
        userId
    }, {
            where: {
                id: quizID
            }
        }).then(() => {
            // After saving, redirect to router.get(/listVideos...) to retrieve all updated
            // videos
            res.redirect('/user/QuizData');
        }).catch(err => console.log(err));
});

router.get('/delete/:id', (req, res) => {
    var quizId = req.params.id;
    Quiz.findOne({
        where: {
            id: quizId
        }
    }).then((quizzes) => {
        console.log("quizIDToDelete.userId : " + quizzes.userId);
        console.log("req.user.id : " + req.user.id);
        if (quizzes.userId === req.user.id) {
            Quiz.destroy({
                where: {
                    id: quizId
                }
            }).then((quizzes) => {
                alertMessage(res, 'success', 'Quiz ID ' + quizId + ' successfully deleted.', 'fa fa-hand-peace-o', true);
                res.redirect('/user/QuizData');
            }).catch(err => console.log(err));
        }
    })
});

router.post('/ForgetPass', (req, res) => {
    
    res.render('../views/user/ForgetPass') // get out of user.js and enter views/user/ForgetPass.handlebars to render
});

// function sendEmail2(userId, email, token) {
//     const sgMail = require('@sendgrid/mail');
//     sgMail.setApiKey(process.env.SENDGRID_API_KEY);
//     const msg = {
//         to: email,
//         from: 'Do Not Reply <admin@gmail.com>',
//         subject: 'Forget Password',
//         text: 'Your passowrd',
//         html: 'Your password is <password>',
//     };
//     sgMail.send(msg);
// }

router.post('/AdminLogin', (req, res) => {
    res.render('../views/user/AdminLogin') // get out of user.js and enter views/user/AdminLogin.handlebars to render
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
                alertMessage(res, 'info', 'User already verified', 'fas fa-exclamation - circle', true);
                res.redirect('/LoginSignUp');
            } else {
                // Verify JWT token sent via URL
                jwt.verify(req.params.token, user.password, (err, authData) => {
                    if (err) {
                        alertMessage(res, 'danger', 'Unauthorised Access, user unverified.', 'fas fa-exclamation - circle', true);
                        res.redirect('/LoginSignUp');
                    } else {
                        User.update(
                            {
                                verified: 1
                            }, {
                                where: { id: user.id }
                            }).then(user => {
                                alertMessage(res, 'success', userEmail + ' verified. Please login', 'fas fa - sign -in -alt', true);
                                res.redirect('/LoginSignUp');
                            });
                    }
                });
            }
        } else {
            alertMessage(res, 'danger', 'Unauthorised Access, user not found.', 'fas fa-exclamation-circle', true);
            res.redirect('/LoginSignUp');
        }
    });
});


module.exports = router;