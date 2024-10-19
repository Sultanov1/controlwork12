import express from 'express';
import User from '../models/User';
import {Error} from 'mongoose';
import {OAuth2Client} from 'google-auth-library';
import config from '../config';
import crypto from 'crypto';
import {imagesUpload} from '../multer';
import auth, {RequestWithUser} from '../middleware/auth';

const userRouter = express();
const client = new OAuth2Client(config.google.clientId, config.google.clientSecret);

userRouter.post('/', imagesUpload.single('avatar'), async (req, res, next) => {
  try {
    const user = new User({
      email: req.body.email,
      password: req.body.password,
      displayName: req.body.displayName,
      avatar: req.file ? req.file.filename : null,
    });

    user.generateToken();
    await user.save();
    res.send({user: user});
  } catch (error) {
    if (error instanceof Error.ValidationError) {
      res.status(400).send(error);
    } else {
      next(error);
    }
  }
});

userRouter.post('/sessions', async (req, res, next) => {
  try {
    const user = await User.findOne({email: req.body.email}).exec();

    if (!user) {
      res.status(422).send({error: 'User not found!'});
      return;
    }
    const isMatch = await user.checkPassword(req.body.password);

    if (!isMatch) {
      res.status(422).send({error: 'Password is wrong!'});
      return;
    }
    user.generateToken();
    await user.save();
    res.send({message: 'Email and password are correct!', user});
  } catch (e) {
    next(e);
  }
});

userRouter.delete('/sessions', auth, async (req: RequestWithUser, res, next) => {
  try {
    if (!req.user) {
       res.status(401).send({error: 'User not found'});
       return;
    }

    res.status(204).send();
  } catch (error) {
     next(error);
  }
})

userRouter.post('/google', async (req, res, next) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: req.body.credential,
      audience: config.google.clientId,
    });
    const payload = ticket.getPayload();
    if (!payload) {
      res.status(400).send({error: 'Google login error!'});
      return;
    }
    const email = payload['email'];
    const id = payload['sub'];
    const displayName = payload['name'];

    if (!email) {
      res.status(400).send({error: 'Not enough user data to continue'});
      return;
    }
    let user = await User.findOne({googleID: id}).exec();

    if (!user) {
      user = new User({
        email,
        password: crypto.randomUUID(),
        googleID: id,
        displayName,
      });
    }
    user.generateToken();
    await user.save();

    res.send({message: 'Login with Google successful!', user});
  } catch (e) {
    next(e);
  }
});

export default userRouter;