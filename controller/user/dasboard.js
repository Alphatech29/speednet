const db = require('../../models/db');

// Function to get user details based on the userUid
const getUserDetails = async (req, res) => {
  const userUid = req.params.userUid;

  if (!userUid) {
    console.warn('User UID not provided in request.');
    return res.status(400).json({ error: 'User UID is required.' });
  }

  try {
    // Perform the query asynchronously with await
    const [result] = await db.query('SELECT * FROM users WHERE uid = ?', [userUid]);

    if (result.length > 0) {
      res.json({ userDetails: result[0] });
    } else {
      console.warn(`User with UID ${userUid} not found.`);
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    console.error('Database error:', err);
    return res.status(500).json({ error: 'Something went wrong. Database error.' });
  }
};

module.exports = { getUserDetails };