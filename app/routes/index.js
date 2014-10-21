var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.render('index', { title: 'Pardon' });
});

router.get('/login', function (req, res) {
    loginNotSuccessful = req.flash('error').length > 0;
    res.render('login', {
        loginNotSuccessful: loginNotSuccessful
    });
});

router.get('/logout', function (req, res){
  req.logout();
  res.redirect('/');
});

module.exports = router;