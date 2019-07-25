const express = require('express');
const router = express.Router();
//const alertMessage = require('../helpers/messenger');
//const moment = require('moment');
const CreditCard = require('../models/Creditcard');
//const ensureAuthenticated = require('../helpers/auth');
const Product = require('../models/Products')
const fs = require('fs');
const upload = require('../helpers/imageUpload');

router.get('/editproduct/:id', (req, res) => {
    Product.findOne({
        where: {
            id: req.params.id
        }
    }).then((product) => {

        // call views/video/editVideo.handlebar to render the edit video page
        
            res.render('./editproduct', {
                product // passes video object to handlebar
            });
        
    }).catch(err => console.log(err)); // To catch no video ID
});

router.put('/saveeditproduct/:id', (req,res)=>{
    let productname = req.body.productname;
    let price = req.body.price;
    let description = req.body.description;
    Product.update({
        productname,
        price,
        description,
    },{
        where:{
            id: req.params.id
        }
    }).then(()=>{
        res.redirect('/shop');
    }).catch(err => console.log(err));
});

router.get('/addproduct',(req,res) =>{
	res.render('addproduct')
});

router.post('/addproduct', (req, res) => {
    let {productname, price, description,posterURL} = req.body;
    // Multi-value components return array of strings or undefined
    Product.create({
        productname,
        price,
        description,
        productimage:posterURL

    }).then((products) => {
        res.redirect('../shop');
    })
        .catch(err => console.log(err))

});


router.post('/upload', (req, res) => {
    // Creates user id directory for upload if not exist
    if (!fs.existsSync('./public/uploads/')) {
        fs.mkdirSync('./public/uploads/');
    }

    upload(req, res, (err) => {
        if (err) {
            res.json({ file: '/img/no-image.jpg', err: err });
        } else {
            if (req.file === undefined) {
                res.json({ file: '/img/no-image.jpg', err: err });
            } else {
                res.json({ file: `/uploads/${req.file.filename}` });
            }
        }
    });
})
module.exports = router;