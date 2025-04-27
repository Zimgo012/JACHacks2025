import { ObjectId } from "mongodb";

// @desc Get all animals
// @route GET /animals/
export const getAnimals = async (req, res) => {
    try {
        const db = req.db;
        const collection = db.collection('animals');

        const animals = await collection.find().toArray();

        res.status(200).json({
            success: true,
            data: animals,
        });
    } catch (err) {
        console.error(`Error fetching animals: ${err.message}`);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch animals',
            data: [],
        });
    }
};

// @desc Get animals by filters (IDs, species, age)
// @route GET /animals/search
export const getAnimalsWithFilters = async (req, res) => {
    try {
        const db = req.db;
        const collection = db.collection('animals');

        const filters = { ...req.query }; // clone query
        const query = {};

        const filterFields = ['id', 'species', 'age'];

        filterFields.forEach(field => {
            if (filters[field]) {
                const values = filters[field]
                    .split(',')
                    .map(v => v.trim().toLowerCase())
                    .filter(Boolean);

                if (values.length > 0) {
                    query[field] = { $in: values.map(v => new RegExp(`^${v}$`, 'i')) }; // case-insensitive exact match
                }
                delete filters[field]; // cleanup processed
            }
        });

        const finalQuery = Object.keys(query).length > 0 ? { $and: Object.entries(query).map(([key, val]) => ({ [key]: val })) } : {};

        const animals = await collection.find({ ...finalQuery, ...filters }).toArray();

        res.status(200).json({
            success: true,
            data: animals,
        });
    } catch (err) {
        console.error(`Error fetching animals with filters: ${err.message}`);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch animals',
            data: [],
        });
    }
};

// @desc Get all users
// @route GET /users/
export const getUsers = async (req, res) => {
    try {
        const db = req.db;
        const collection = db.collection('users');

        const users = await collection.find().toArray();

        res.status(200).json({
            success: true,
            data: users,
        });
    } catch (err) {
        console.error(`Error fetching users: ${err.message}`);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch users',
            data: [],
        });
    }
};
