const { getAccountsByUserUid: fetchAccountsByUserUid } = require('../../utility/product');


async function getAccounts(req, res) {
    const { userUid } = req.params;
    
    if (!userUid) {
        return res.status(400).json({ message: 'userUid is required' });
    }

    try {
        const accounts = await fetchAccountsByUserUid(userUid);
        res.status(200).json({ accounts }); 
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ message: error.message });
    }
}

module.exports = { getAccounts };
