import express from 'express';
import Post from '../models/Post';
import mongoose from 'mongoose';
import auth, {RequestWithUser} from '../middleware/auth';
import {imagesUpload} from '../multer';
import permit from '../middleware/permit';
import {PostUser} from '../types';

const postRouter = express.Router();

postRouter.get('/', async (req , res, next) => {
  try {
    const user = req.query.user as string;

    if(user && req.query.user) {
      const result = await Post.find({user: req.query.user}).populate('user', 'displayName');
      res.send(result);
      return;
    }

    const posts = await Post.find().populate('user', 'displayName');
    res.send(posts);
  } catch (e) {
    next(e);
  }
});


postRouter.get('/:id', async (req, res) => {
  try {
    const result = await Post.findById(req.params.id).populate('user', 'displayName');

    if (!result) {
      res.status(404).send({error: 'Post not found!'});
      return;
    }

    res.send(result);
  } catch {
    res.sendStatus(500);
  }
});

postRouter.post('/', auth, imagesUpload.single('image'), async (req, res, next) => {
    const user = (req as RequestWithUser).user;

    if (!req.file) return res.status(400).send({error: 'Image is required!'});

    const postDate: PostUser = {
      name: req.body.name,
      image: req.file.filename,
      user: user._id,
    };

    const post = new Post(postDate);

    try {
      await post.save();
      return res.send(post);
    } catch (e) {
      if (e instanceof mongoose.Error.ValidationError) {
        return res.status(400).send(e);
      }

      next(e);
    }
  },
);

postRouter.patch('/:id/togglePublished', auth, permit('admin'),
  async (req, res, next) => {
    try {
      const post_id = req.params.id;
      const post = await Post.findById(post_id);

      if (!post) {
        return res.status(404).send({error: 'Not found!'});
      }

      post.published = !post.published;

      await post.save();
      return res.send(post);
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        return res.status(400).send(error);
      }

      return next(error);
    }
  },
);

postRouter.delete('/:id', auth, permit('admin'), async (req, res, next) => {
  try {
    const post_id = req.params.id;
    const cocktail = await Post.findOne({_id: post_id});

    if (!cocktail) {
      return res.status(404).send({error: 'Not found!'});
    }

    await Post.deleteOne({_id: post_id});
    return res.send('Post deleted');
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(error);
    }

    return next(error);
  }
});

export default postRouter;