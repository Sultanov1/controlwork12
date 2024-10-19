import express from "express";
import User from "../models/User";
import {Error} from "mongoose";
import {OAuth2Client} from "google-auth-library";
import config from "../config";
import crypto from "crypto";
import {imagesUpload} from "../multer";

const userRouter = express();
const client = new OAuth2Client(config.google.clientId,config.google.clientSecret);

userRouter.post('/', imagesUpload.single('image'), async (req, res, next) => {
  try {
    const user = new User({
      email: req.body.email,
      password: req.body.password,
      displayName: req.body.displayName,
      image: req.file ? req.file.filename : null,
    });

    user.generateToken();

    await user.save();
    return res.send({ user: user });
  } catch (error) {
    if (error instanceof Error.ValidationError) {
      return res.status(400).send(error);
    }
    return next(error);
  }
});
userRouter.post('/sessions', async (req, res, next) => {
  try {
    const user = await User.findOne({email: req.body.email}).exec();

    if(!user) {
      return res.status(422).send({error: 'User not found!'});
    }

    const isMatch = await user.checkPassword(req.body.password);

    if(!isMatch) {
      return res.status(422).send({error: 'Password is wrong!'});
    }

    user.generateToken();
    await user.save();

    return res.send({message: 'Email and password are correct!', user});
  } catch (e) {
    return next(e);
  }
});

userRouter.delete('/sessions', async (req, res, next) => {
  try {
    const token = req.get('Authorization');
    const success = {message: 'Success'};

    if (!token) return res.send(success);

    const user = await User.findOne({token}).exec();

    if (!user) return res.send(success);

    user.generateToken();
    user.save();

    return res.send(success);
  } catch (e) {
    return next(e);
  }
});

userRouter.post('/google', imagesUpload.single('image'), async (req, res, next) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: req.body.credential,
      audience: config.google.clientId,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      return res.status(400).send({ error: 'Google login error!' });
    }

    const email = payload['email'];
    const id = payload['sub'];
    const displayName = payload['name'];
    const picture = payload['picture'];

    if (!email) {
      return res.status(400).send({ error: 'Not enough user data to continue' });
    }

    let user = await User.findOne({ googleID: id }).exec();

    if (!user) {
      user = await User.findOne({ email: email }).exec();
    }

    if (!user) {
      user = new User({
        email: email,
        password: crypto.randomUUID(),
        image: picture ? picture : null,
        googleID: id,
        displayName,
      });
    }

    user.generateToken();
    await user.save();

    return res.send({ message: 'Login with Google successful!', user });
  } catch (e) {
    return next(e);
  }
});

export default userRouter;