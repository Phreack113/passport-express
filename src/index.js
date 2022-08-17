const express = require('express');
const engine = require('ejs-mate');
const path = require('path');
const morgan = require('morgan'); 
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');

//Initializations
const app = express();
require('./database'); //Inicializo la base de datos
require('./passport/local-auth');

//Settings
app.set('views', path.join(__dirname, 'views')); //Le indico a EJS en que carpeta estan las vistas
app.engine('ejs', engine); //Necesario para usar EJS
app.set('view engine', 'ejs') ////Necesario para usar EJS
app.set('port', process.env.PORT || 3000); //Utiliza el puerto del sistema operativo (lo utiliza cuando subimos el código al servidor) o usa el puerto 3000

//Middlewares
app.use(morgan('dev')); //Visualizar peticiones desde consola
app.use(express.urlencoded({extended: false})); //Le indicamos a express que podemos recibir datos a traves de un formulario
app.use(session({
    secret: 'mysecretsession',
    resave: false,
    saveUninitialized: false
})); //Configura la sessión
app.use(flash()); //el middleware de flash debe ir despues de las sesiones y antes de passport 
app.use(passport.initialize());
app.use(passport.session());

//Middleware Manual
app.use((req, res, next) => {
    app.locals.signupMessage = req.flash('signupMessage'); //si lo guardo en app.locals es una variable accesible desde toda la aplicación
    app.locals.signinMessage = req.flash('signinMessage');
    app.locals.user = req.user; //De esta manera queda el objeto user disponible para usar desde cualquier lugar del archivo, puedo usar user.password, user.mail, user._id
    next();
});

//Routes
app.use('/', require('./routes/index'));

//Starting the server
app.listen(app.get('port'), () => {
    console.log('Server on port:', app.get('port'));
})