import { ObjectId } from 'mongodb';

//@desc update animal
//@route PUT /animal/:id
export const updateAnimal = async (req, res) => {
    try {
        const db = req.db;
        const collection = db.collection('animals');

        const { id } = req.params;
        const updateData = req.body;

        // Validate ID format
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'Invalid ID format' });
        }

        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ success: false, message: 'Animal not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Animal updated successfully'
        });
    } catch (err) {
        console.error(`Error updating animal: ${err.message}`);
        res.status(500).json({
            success: false,
            message: 'Failed to update animal'
        });
    }
};
