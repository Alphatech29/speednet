const { insertPlatform, getAllPlatforms,deletePlatformById } = require('../../../utility/platform');

const addPlatform = async (req, res) => {
  try {
    const { name } = req.body;
    const file = req.file;

    if (!name || !file) {
      return res.status(400).json({ message: 'Both name and image file are required.' });
    }

    const image_path = `/uploads/${file.filename}`;

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

const fetchPlatforms = async (req, res) => {
  try {
    const platforms = await getAllPlatforms();
    res.status(200).json({ platforms });
  } catch (err) {
    console.error('Fetch failed:', err.message);
    res.status(500).json({ message: 'Unable to retrieve platforms' });
  }
};

const deletePlatformByIdHandler = async (req, res) => {
  const { id } = req.params;
  console.log('id received from frontend', id)

  try {
    const deleted = await deletePlatformById(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Platform not found' });
    }

    res.status(200).json({ message: 'Platform deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error while deleting platform' });
  }
};

module.exports = { addPlatform, fetchPlatforms,deletePlatformByIdHandler };
