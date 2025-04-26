import express from 'express';
import * as postController from '../controllers/postController.js'
import * as deleteController from '../controllers/deleteController.js'
import * as getController from '../controllers/getController.js'
import * as updateController from '../controllers/updateController.js'

const animalRouter = express.Router();

//@desc get all Animal
animalRouter.get('/', getController.getAnimals)

//@desc get Animal by filter
animalRouter.get('/search', getController.getAnimalsWithFilters)

//@desc create Animal
animalRouter.post('/', postController.addAnimal);

//@desc delete Animal
animalRouter.delete('/:id', deleteController.deleteAnimal);


export default animalRouter;