//@desc This file is used for controlling get request

//@desc Get All animals
//@route GET /animals/
export const getAnimals = async (req, res, next) => {

    try{
        const db = req.db;
        const collection = db.collection('animals');

        const animals = await collection.find().toArray();

        res.status(200).json({
            success: true,
            data: animals
        });
    }catch (err){
        console.error(`Error fetching animals: ${err.message}`);

        res.status(500).json({
            success: false,
            message: 'Failed to fetch animals'
        })
    }

}


//@desc Get animals by animal type
//@route GET /animals/
export const getAnimalsWithFilters = async (req, res) => {
    try {
        const db = req.db;
        const collection = db.collection('animals');

        const filters = req.query; // All query parameters become filters

        const animals = await collection.find(filters).toArray();

        if (!animals || animals.length === 0) {
            return res.status(404).json({ success: false, message: 'No animals found with given filters' });
        }

        res.status(200).json({
            success: true,
            data: animals
        });
    } catch (err) {
        console.error(`Error fetching animals with filters: ${err.message}`);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch animals'
        });
    }
}