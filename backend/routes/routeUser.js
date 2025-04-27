import express from 'express';
import { checkJwt } from '../middleware/authMiddleware.js';
import * as postController from '../controllers/postController.js'
import * as deleteController from '../controllers/deleteController.js'
import * as getController from '../controllers/getController.js'
import * as updateController from '../controllers/updateController.js'


const userRouter = express.Router();


//@desc create User
userRouter.post('/', checkJwt, postController.addUser);

//@desc add for Auth0 hooks
userRouter.post('/auth0_hook', postController.addUserFromHook)

//@desc delete user


//@desc update user


//@desc find all users

//@desc find user by id
// userRouter.get('/',getController)

//@desc contact
userRouter.post('/contact', postController.addContact)
export default userRouter;