//@desc add Animal
//@route POST /animals/
export const addAnimal = async(req, res, next) => {
    const db = req.db;
    const newPost = req.body;

    try{
        const animalData = {
            ...newPost,              // Spread all fields first
            images: newPost.images || [], // If images not sent, default to empty array
            createdAt: new Date()
        };

        const result = await collection.insertOne(animalData);

        res.status(201).send({
            success: true,
            message: 'Animal added successfully',
            id: result.insertedId
        });
    } catch (err) {
        console.error('Error creating animal.', err);
        res.status(500).send({
            success: false,
            error: 'Failed to create Animal'
        });
    }
};


//@desc add User
//@route /users/
export const addUser = async(req, res, next) => {

    const db = req.db;
    const newUser = req.body;

    try {
        const users = db.collection('users');
        const existingUser = await users.findOne({ email: newUser.email });

        if (existingUser) {
            return res.status(200).json({ message: 'User already exists' });
        }

        const userData = {
            email: newUser.email,
            name: newUser.name,
            createdAt: new Date()
        };

        const result = await users.insertOne(userData);

        res.status(201).json({ message: 'User saved', id: result.insertedId });
    } catch (err) {
        console.error('Failed to save user:', err);
        res.status(500).json({ error: 'Server error' });
    }
}

//@desc save user from Auth0 hook
//@route /users/auth0_hook
export const addUserFromHook = async (req, res) => {
    const db = req.db;
    const { email, name, hook_secret } = req.body;

    if (hook_secret !== process.env.AUTH0_HOOK_SECRET) {
        return res.status(401).json({ error: 'Unauthorized access' });
    }

    if (!email) {
        return res.status(400).json({ error: 'Missing email' });
    }

    try {
        const users = db.collection('users');
        const existingUser = await users.findOne({ email });

        if (existingUser) {
            return res.status(200).json({ message: 'User already exists (hook)' });
        }

        const userData = {
            email,
            name: name || '',
            createdAt: new Date()
        };

        const result = await users.insertOne(userData);

        res.status(201).json({ message: 'User saved (hook)', id: result.insertedId });
    } catch (err) {
        console.error('Failed to save user from hook:', err);
        res.status(500).json({ error: 'Server error (hook)' });
    }
};