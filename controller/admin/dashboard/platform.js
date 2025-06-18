const { insertPlatform, getAllPlatforms } = require('../../../utility/platform');

const addPlatform = async (req, res) => {
  try {
    const { name, image_path } = req.body;

    // Basic validation
    if (!name || !image_path) {
      return res.status(400).json({ message: 'Both name and image_path are required.' });
    }

    // Insert into database
    const newId = await insertPlatform({ name, image_path });

    return res.status(201).json({
      message: 'Platform successfully added',
      platformId: newId,
    });

  } catch (error) {
    console.error('Error in addPlatform:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


// Fetch all platforms from the database
const fetchPlatforms = async (req, res) => {
  try {
    const platforms = await getAllPlatforms();
    res.status(200).json({ platforms });
  } catch (err) {
    console.error('Fetch failed:', err.message);
    res.status(500).json({ message: 'Unable to retrieve platforms' });
  }
};



module.exports = { addPlatform, fetchPlatforms };
