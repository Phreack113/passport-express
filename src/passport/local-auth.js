const passport = require('passport');
//Requiero la estrategia
const LocalStrategy =require('passport-local').Strategy;

const User = require('../models/users');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user.id);
});

//done es una función, es un callback, una vez que finalice toda la función vamos a usar la función done para enviar un mensaje al cliente
passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {  
    const user = await User.findOne({email: email});
    if (user){
        return done(null, false, req.flash('signupMessage','The Email is alredy taken.')); //El req.flash lleva dos parametros, el nombre del topico del mensaje que querramos y el mensaje
    } else {
        const newUser = new User();
        newUser.email = email;
        newUser.password = newUser.encryptPassword(password);
        await newUser.save();
        done(null, newUser);
    }
}));

passport.use('local-signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    const user = await User.findOne({email: email});
    if (!user) {
        return done(null, false, req.flash('signinMessage','No user found.'));
    }
    if (!user.comparePassword(password)) {
        return done(null, false, req.flash('signinMessage', 'Incorrect password'));
    }
    done (null, user);

}));
