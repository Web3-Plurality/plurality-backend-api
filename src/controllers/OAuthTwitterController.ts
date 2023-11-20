import express, { Request, Response } from "express";
import passport from "passport";
import { Strategy } from '@superfaceai/passport-twitter-oauth2';
import * as dotenv from 'dotenv';

export const twitterRouter = express.Router();

dotenv.config();

// Serialization and deserialization
passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (obj: any, done) {
  done(null, obj);
});



// Start authentication flow
twitterRouter.get(
  '/',
  async (req: Request, res: Response, next) => {
    const isWidget = req.query.isWidget;
    let callback = "";
    if (isWidget == "true") {
      callback = `${process.env.TWITTER_CALLBACK_URL}?isWidget=true` 
    }
    else {
      callback = `${process.env.TWITTER_CALLBACK_URL}?isWidget=false` 

    }
      // Use the Twitter OAuth2 strategy within Passport
    passport.use(
      // Strategy initialization
      new Strategy(
        {
          clientID: process.env.TWITTER_CLIENT_ID!,
          clientSecret: process.env.TWITTER_CLIENT_SECRET!,
          clientType: 'confidential',
          callbackURL: callback,
        },
        // Verify callback
        (accessToken, refreshToken, profile, done) => {
          console.log('Success!', { accessToken, refreshToken });
          return done(null, profile);
        }
      )
    );
    next();
    },
    passport.authenticate('twitter', {
      // Scopes
      scope: ['tweet.read', 'users.read', 'offline.access'],
    })
  );

// Callback handler
twitterRouter.get(
  '/callback',
  passport.authenticate('twitter'),
  function (req, res) {
    const userData = JSON.stringify(req.user, undefined, 2);
    console.log(`${userData}`);
    const o : any = JSON.parse(userData);
    console.log(o.username);
    console.log(o.displayName);
    res.redirect(`${process.env.VERIFIER_UI_URL}?isWidget=${req.query.isWidget}&id_platform=twitter&username=${o.username}&display_name=${o.displayName}`);
  }
);
