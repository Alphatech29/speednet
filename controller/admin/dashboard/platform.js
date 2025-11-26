const {
  insertPlatform,
  getAllPlatforms,
  deletePlatformById,
  updatePlatformById,
} = require('../../../utility/platform');

const addPlatform = async (req, res) => {
  try {
    const { name, type } = req.body;
    const file = req.file;

    if (!name || !type || !file) {
      return res.status(400).json({ message: 'All input are required.' });
    }

    const image_path = `/uploads/${file.filename}`;
    const newId = await insertPlatform({ name, type, image_path });

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
  console.log('id received from frontend', id);

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

const editPlatformById = async (req, res) => {
  const { id } = req.params;
  const { name, type } = req.body;
  const file = req.file;

  const updatedData = {};
  if (name) updatedData.name = name;
  if (type) updatedData.type = type;
  if (file) updatedData.image_path = `/uploads/${file.filename}`;

  if (Object.keys(updatedData).length === 0) {
    return res.status(400).json({ message: 'No valid fields to update.' });
  }

  try {
    const success = await updatePlatformById(id, updatedData);

    if (!success) {
      return res.status(404).json({ message: 'Platform not found or not updated' });
    }

    return res.status(200).json({ message: 'Platform updated successfully' });
  } catch (error) {
    console.error('Error in editPlatformById:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  addPlatform,
  fetchPlatforms,
  deletePlatformByIdHandler,
  editPlatformById,
};
