import express from 'express';
import * as postController from '../controllers/postController.js';
import * as deleteController from '../controllers/deleteController.js';
import * as getController from '../controllers/getController.js';
import * as updateController from '../controllers/updateController.js';

const animalRouter = express.Router();

// @desc Get all animals
animalRouter.get('/', getController.getAnimals);

// @desc Get animals with filters
animalRouter.get('/search', getController.getAnimalsWithFilters);

// @desc Create new animal
animalRouter.post('/', postController.addAnimal);

// @desc Delete animal
animalRouter.delete('/:id', deleteController.deleteAnimals);

// (Optional) @desc Update animal (if you add this)
// animalRouter.put('/:id', updateController.updateAnimal);

export default animalRouter;
