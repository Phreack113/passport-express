const express = require('express');
const { append } = require('express/lib/response');
const routes = express.Router();
const passport = require('passport');
const { authenticate } = require('passport/lib');

/*
Middelware manual para gestionar acceso y proteger multiples rutas
//El metodo use SIEMPRE se ejecuta antes de get
routes.use((req, res, next) => {
    req.isAuthenticated(req, res, next);
    next();
});
*/

//Esta función será un middelware que evaluará si existe sessión para el usuario o no, y de esa forma puedo proteger rutas
function isAuthenticated (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    };
    res.redirect('/');
};

routes.get('/', (req, res, next) => {
    res.render('index');
});

//Ruta para desloguearse
routes.get('/logout', (req, res, next) => {
    req.logout(); //Elimina la sesion del usuario
    res.redirect('/');
});

//Con esta ruta le envío la ventana del singup
routes.get('/signup', (req, res, next) => {
    res.render('signup')
});

//Desde esta ruta recibo los datos que llegan por post (usuario, pass)
routes.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    passReqToCallback: true
}));

//Con esta ruta le envío la ventana del singin
routes.get('/signin', (req, res, next) => {
    res.render('signin');
});

//Desde esta ruta recibo los datos de registro que llegan por post (usuario, pass)
routes.post('/signin', passport.authenticate('local-signin', {
    successRedirect: '/profile',
    failureRedirect: '/signin',
    passReqToCallback: true
}));

routes.get('/profile', isAuthenticated, (req, res, next) => {
    res.render('profile');
});

module.exports = routes;

