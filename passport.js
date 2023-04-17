const LinkedInStrategy = require("passport-linkedin-oauth2").Strategy;

const passport = require("passport");
require("dotenv").config();

const USER = require("./models/users");

const LINKEDIN_CLIENT_ID = process.env.LINKEDIN_CLIENT_ID;
const LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET;

passport.use(new LinkedInStrategy({
  clientID: LINKEDIN_CLIENT_ID,
  clientSecret: LINKEDIN_CLIENT_SECRET,
  callbackURL: "/auth/linkedin/callback",
  scope: ['r_emailaddress', 'r_liteprofile']
},
async function(accessToken, refreshToken, profile, done) {
  try {
    const existingUser = await USER.findOne({ email: profile.emails[0].value });
    if (existingUser) {
      return done(null, existingUser);
    }
    const newUser = new USER({
      userName: profile.displayName,
      email: profile.emails[0].value,
      avatarUrl:profile.photos[0].value,
      source: "LinkedIn",
      accessToken:accessToken
    });
    await newUser.save();
    return done(null, newUser);
  } catch (err) {
    return done(err);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
