import express from 'express';
import * as postController from '../controllers/postController.js'
import * as deleteController from '../controllers/deleteController.js'
import * as getController from '../controllers/getController.js'
import * as updateController from '../controllers/updateController.js'


const userRouter = express.Router();


//@desc create User



export default userRouter;