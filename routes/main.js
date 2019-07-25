const express = require('express');
const router = express.Router();
const alertMessage = require('../helpers/messenger')
const Products = require('../models/Products')
const fs = require('fs');
const upload = require('../helpers/imageUpload');
router.get('/index', (req, res) => {
	res.render('index')
});

router.post('/upload', (req, res) => {
	// Creates user id directory for upload if not exist
	if (!fs.existsSync('./public/uploads/' + req.user.id)){
	fs.mkdirSync('./public/uploads/' + req.user.id);
	}
   
	upload(req, res, (err) => {
	if (err) {
	res.json({file: '/img/no-image.jpg', err: err});
	} else {
	if (req.file === undefined) {
	res.json({file: '/img/no-image.jpg', err: err});
	} else {
	res.json({file: `/uploads/${req.user.id}/${req.file.filename}`});
	}
	}
	});
   })

// Logout User
router.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/');
});

router.get('/about', (req, res) => {

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
});

router.get('/showLogin', (req, res) => {
	res.render('user/login') // renders views/user/login.handlebars
});

router.get('/showRegister', (req, res) => {
	res.render('user/register') // renders views/register.handlebars
});

router.get('/blog', (req, res) => {
	res.render('blog') 
});

router.get('/404', (req, res) => {
	res.render('404') 
});
router.get('/about', (req, res) => {
	res.render('about') 
});
router.get('/blog-single', (req, res) => {
	res.render('blog') 
});
router.get('/cart', (req, res) => {
	Products.findAll({
		raw: true
	}).then((products) =>{
	res.render('cart', {
		products:products[products.length - 1]
	});
	}).catch(err => console.log(err));
});
router.get('/checkout', (req, res) => {
	Products.findAll({
		raw: true
	}).then((products) =>{
	res.render('checkout', {
		products:products[products.length - 1]
	});
	}).catch(err => console.log(err));
});
router.get('/contactus', (req, res) => {
	res.render('contact-us') 
});
router.get('/login', (req, res) => {
	res.render('login') 
});
router.get('/productdetails', (req, res) => {
	res.render('product-details') 
});
router.get('/shop', (req, res) =>{
	Products.findAll({
		raw: true
	}).then((products) =>{
	res.render('shop', {
		products:products
	});
	}).catch(err => console.log(err));
});
router.get('/creditcard', (req,res) => {
	res.render('creditcard')
});
router.get('/', (req,res) => {
	res.render('index')
});
router.get('/addproduct',(req,res) =>{
	res.render('addproduct')
});
router.get('/editproduct',(req,res) =>{
	res.render('editproduct')
});
module.exports = router;
