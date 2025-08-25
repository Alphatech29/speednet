// controllers/pageController.js
const { getPageBySlug } = require('../../utility/page');

const getPagesBySlug = async (req, res) => {
  const { slug } = req.params;

  try {
    const page = await getPageBySlug(slug);

    if (!page) {
      return res.status(404).json({ message: 'Page not found' });
    }

    res.status(200).json(page);
  } catch (error) {
    console.error('Controller error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getPagesBySlug,
};
