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


