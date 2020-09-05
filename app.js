const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const fakeDB = require('./fakeDB'); // Fake Database with built in functions to fetch data

// Common functionality setup
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// SESSION SETUP
app.use(session({
  secret: 'do not hide in the oven',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());


// PASSPORT STRATEGY SETUP
// Strategy is only called when a user attempts to log in
// note the chain of callbacks. The method looking for the username must provide matching callback parameters
// foo (username, callback) {... callback(err, userObject)}
// matching passwords needs to be done with bcrypt's compare method
passport.use(new LocalStrategy(
  function (username, password, done) {
    fakeDB.findByUsername(username, (err, user) => {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      if (user.password != password) { return done(null, false); } 
      return done(null, user);
    });
  }
));

// SERIALIZE & DESERIALIZE
// SERIALIZE is called only once to place user's ID (or any one piece of information from user's object) in the session (req.session.passport.user)
// DESERIALIZE is called with each call requesting logged in user's full object info at req.user 
// Together this couple makes sure user Object is available any time requested, while keeping itself out of the cookie and only storing an ID there
// As a reminder, express-session also encrypts cookies. That said, extra security measures are still needed

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  fakeDB.findByID(id, function (err, user) {
    console.log(">>> deserializer called >>>");
    
    delete user.password; // retrieving the password with each user's request is not necessary at all. it can either be removed here or within .findByID method
    done(err, user);
    
  });
});

// Routes

app.get('/', (req, res, next) => {
  if (req.user) res.send(`<p>Grats <strong>${req.user.firstname}</strong>, you are now logged in! If you don't beleive me, try another page: <a href="/factchecker">factchecker</a></p><p><a href="/logout">Log Out</a></p>`)
  else res.send('<p>no one is logged in........ try again: <a href="/login">login</a></p>');
});

app.get('/login', (req, res, next) => {
  res.send(`
    <form method="POST">
      <input type="username" name="username" value="petros"}">
      <input type="password" name="password" value="123">
      <input type="submit">
    </form>
  `);
});

app.post('/login',
  passport.authenticate('local', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/');
  });

app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

app.get('/factchecker', (req, res, next) => {
  if (req.user) res.send(req.user);
  else res.send('<p>No data here yet</p>')
});

app.get('/session', (req, res, next) => {
  if (req.session) res.send(req.session);
  else res.send('<p>No data here yet</p>')
});

app.get('/empty-page', (req, res, next) => {
  res.send('<p>This is to confirm that even when you don\'t need any data from the signed in USer object, passport still calls deserialize</p>')
});

const PORT = 3000;
app.listen(PORT, () => console.log('\x1b[32m', `>>> Server URL: http://localhost:${PORT}`, '\x1b[0m'));