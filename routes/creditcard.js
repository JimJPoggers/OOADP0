const express = require('express');
const router = express.Router();
//const alertMessage = require('../helpers/messenger');
//const moment = require('moment');
const CreditCard = require('../models/Creditcard');
//const ensureAuthenticated = require('../helpers/auth');
//const fs = require('fs');
//const upload = require('../helpers/imageUpload');

router.post('/creditcard', (req, res) => {
    let {CreditCardNum,ExpiryDate,SecurityNum,HolderName} = req.body;
    CreditCard.create({
        CreditCardNum,
        ExpiryDate,
        SecurityNum,
        HolderName
    }).then((creditcard) => {
        res.redirect('../index');
    })
        .catch(err => console.log(err))

});

module.exports = router;