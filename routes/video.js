const express = require('express');
const router = express.Router();
const alertMessage = require('../helpers/messenger');
const moment = require('moment');
const Video = require('../models/Video');
const ensureAuthenticated = require('../helpers/auth');
// Practical 10 Activity 02 - Required for file upload
const fs = require('fs');
const upload = require('../helpers/imageUpload');


// List videos belonging to current logged in user
router.get('/listVideos', ensureAuthenticated, (req, res) => {
    Video.findAll({
        where: {
            userId: req.user.id
        },
        order: [
            ['title', 'ASC']
        ],
        raw: true
    }).then((videos) => {
        // pass object to listVideos.handlebar
        res.render('video/listVideos', {
            videos: videos
        });
    }).catch(err => console.log(err));
});

// Route to the page for User to add a new video
router.get('/showAddVideo', ensureAuthenticated, (req, res) => {
    res.render('video/addVideo', { // pass object to listVideos.handlebar
        videos: 'List of videos'
    });
});

// Adds new video jot from /video/addVideo
router.post('/addVideo', ensureAuthenticated, (req, res) => {
    let title = req.body.title;
    let story = req.body.story.slice(0, 1999);
    let dateRelease = moment(req.body.dateRelease, 'DD/MM/YYYY');
    let language = req.body.language.toString();
    let subtitles = req.body.subtitles === undefined ? '' : req.body.subtitles.toString();
    let classification = req.body.classification;
    let starring = req.body.starring; // Practical 09 Exercise 02
    let posterURL = req.body.posterURL; // Practical 09 Exercise 02
    let userId = req.user.id;
    // Multi-value components return array of strings or undefined
    Video.create({
        title,
        story,
        classification,
        language,
        subtitles,
        dateRelease,
        userId,
        starring,
        posterURL
    }).then((video) => {
        res.redirect('/video/listVideos');
    })
        .catch(err => console.log(err))

});

// Shows edit video page
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Video.findOne({
        where: {
            id: req.params.id
        }
    }).then((video) => {

        if (req.user.id === video.userId) {
            checkOptions(video);
            // call views/video/editVideo.handlebar to render the edit video page
            res.render('video/editVideo', {
                video // passes video object to handlebar
            });
        } else {
            // Video does not belong to the current user
            alertMessage(res, 'danger', 'Unauthorized Access.', 'fas fa-exclamation-circle', true);
            req.logout();
            res.redirect('/');
        }
    }).catch(err => console.log(err)); // To catch no video ID
});

// Creates variables with ‘check’ to put a tick in the appropriate checkbox
function checkOptions(video) {
    // Language
    video.chineseLang = (video.language.search('Chinese') >= 0) ? 'checked' : '';
    video.englishLang = (video.language.search('English') >= 0) ? 'checked' : '';
    video.malayLang = (video.language.search('Malay') >= 0) ? 'checked' : '';
    video.tamilLang = (video.language.search('Tamil') >= 0) ? 'checked' : '';
    // Subtitles
    video.chineseSub = (video.subtitles.search('Chinese') >= 0) ? 'checked' : '';
    video.englishSub = (video.subtitles.search('English') >= 0) ? 'checked' : '';
    video.malaySub = (video.subtitles.search('Malay') >= 0) ? 'checked' : '';
    video.tamilSub = (video.subtitles.search('Tamil') >= 0) ? 'checked' : '';
}

// Save edited video
router.put('/saveEditedVideo/:id', ensureAuthenticated, (req, res) => {
    let title = req.body.title;
    let story = req.body.story.slice(0, 1999);
    let dateRelease = moment(req.body.dateRelease, 'DD/MM/YYYY');
    let language = req.body.language.toString();
    let subtitles = req.body.subtitles === undefined ? '' : req.body.subtitles.toString();
    let classification = req.body.classification;
    let starring = req.body.starring; // Practical 09 Exercise 02
    let posterURL = req.body.posterURL; // Practical 09 Exercise 02
    let userId = req.user.id;
    var videoID = req.params.id;
    // Retrieves edited values from req.body
    Video.update({
        // Set variables here to save to the videos table
        title,
        story,
        dateRelease,
        language,
        subtitles,
        classification,
        userId,
        starring,
        posterURL
    }, {
            where: {
                id: videoID
            }
        }).then(() => {
            // After saving, redirect to router.get(/listVideos...) to retrieve all updated
            // videos
            res.redirect('/video/listVideos');
        }).catch(err => console.log(err));
});


router.get('/delete/:id', ensureAuthenticated, (req, res) => {
    var videoId = req.params.id;
    Video.findOne({
        where: {
            id: videoId
        }
    }).then((video) => {
        console.log("videoIDToDelete.userId : " + video.userId);
        console.log("req.user.id : " + req.user.id);
        if (video.userId === req.user.id) {
            Video.destroy({
                where: {
                    id: videoId
                }
            }).then((video) => {
                // For icons to use, go to https://glyphsearch.com/
                alertMessage(res, 'success', 'Video ID ' + videoId + ' successfully deleted.', 'fa fa-hand-peace-o', true);
                res.redirect('/video/listVideos');
            }).catch(err => console.log(err));
        } else {
            // Video does not belong to the current user
            alertMessage(res, 'danger', 'Unauthorized Access.', 'fas fa-exclamation-circle', true);
            req.logout();
            res.redirect('/');
        }
    })
});

// Practical 10 Activity 02
// Upload poster
router.post('/upload', ensureAuthenticated, (req, res) => {
    // Creates user id directory for upload if not exist
    if (!fs.existsSync('./public/uploads/' + req.user.id)) {
        fs.mkdirSync('./public/uploads/' + req.user.id);
    }

    upload(req, res, (err) => {
        if (err) {
            res.json({ file: '/img/no-image.jpg', err: err });
        } else {
            if (req.file === undefined) {
                res.json({ file: '/img/no-image.jpg', err: err });
            } else {
                res.json({ file: `/uploads/${req.user.id}/${req.file.filename}` });
            }
        }
    });
})

module.exports = router;