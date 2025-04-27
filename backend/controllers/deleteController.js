import { ObjectId } from 'mongodb';

//@desc delete multiple animals
//@route DELETE /animal
export const deleteAnimals = async (req, res) => {
    try {
        const db = req.db;
        const collection = db.collection('animals');

        const { ids } = req.body;

        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ success: false, message: 'No IDs provided' });
        }

        // Validate each ID
        const objectIds = ids.map(id => {
            if (!ObjectId.isValid(id)) {
                throw new Error(`Invalid ID: ${id}`);
            }
            return new ObjectId(id);
        });

        const result = await collection.deleteMany({ _id: { $in: objectIds } });

        if (result.deletedCount === 0) {
            return res.status(404).json({ success: false, message: 'No animals deleted' });
        }

        res.status(200).json({
            success: true,
            message: `${result.deletedCount} animals deleted successfully`
        });
    } catch (err) {
        console.error(`Error deleting animals: ${err.message}`);
        res.status(500).json({
            success: false,
            message: 'Failed to delete animals'
        });
    }
};
