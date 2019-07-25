const express = require('express');
const router = express.Router();
const alertMessage = require('../helpers/messenger')

router.get('/', (req, res) => {
	res.render('layouts/index')
});

// Logout User
router.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/');
});

/*router.get('/about', (req, res) => {

	let success_msg = 'Success message';
	let error_msg = 'Error message using error_msg';

	alertMessage(res, 'success',
		'This is an important message', 'fas fa-sign-in-alt', true);
	alertMessage(res, 'danger',
		'Unauthorised access', 'fas fa-exclamation-circle', false);

	var errorTexts = [
		{ text: "Error message using error object" },
		{ text: "First error message🙅‍♀️" },
		{ text: "Second error message 🚫" },
		{ text: "Third error message⛔" }
	];


	var dev_name = "🧐 Happy 脸😀"
	res.render('about', {
		developer_name: dev_name,
		success_msg: success_msg,
		error_msg: error_msg,
		errors: errorTexts
	}) // renders views/about.handlebars
}); */

router.get('/LoginSignUp', (req, res) => {
	res.render('user/LoginSignUp') // renders views/user/LoginSignUp.handlebars
});

router.get('/ForgetPass', (req, res) => {
	res.render('user/ForgetPass') // renders views/user/ForgetPass.handlebars
});

router.get('/AdminLogin', (req, res) => {
	res.render('user/AdminLogin') // renders views/user/AdminLogin.handlebars
});

router.get('/Weight', (req, res) => {
	res.render('user/Weight') // renders views/user/Weight.handlebars
});

router.get('/Height', (req, res) => {
	res.render('user/Height') // renders views/user/Height.handlebars
});

router.get('/Result', (req, res) => {
	res.render('user/Result') // renders views/user/Result.handlebars
});

router.get('/DragnDrop', (req, res) => {
	res.render('user/DragnDrop') // renders views/user/DragnDrop.handlebars
});

router.get('/Quiz', (req, res) => {
	res.render('user/Quiz') // renders views/user/DragnDrop.handlebars
});

router.get('/QuizData', (req, res) => {
	res.render('user/QuizData') // renders views/user/DragnDrop.handlebars
});

router.get('/addQuiz', (req, res) => {
	res.render('user/addQuiz') // renders views/user/DragnDrop.handlebars
});

module.exports = router;
