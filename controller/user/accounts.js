// Import the function from the controller
const { getAccountsByUserUid: fetchAccountsByUserUid } = require('../../utility/product');

// Example of handling userUid dynamically from a request
async function getAccounts(req, res) {
    const { userUid } = req.params;  // Expect userUid to come from the frontend (as a URL parameter, for example)
    
    if (!userUid) {
        return res.status(400).json({ message: 'userUid is required' });
    }

    try {
        const accounts = await fetchAccountsByUserUid(userUid);  // Call the function with the userUid
        res.status(200).json({ accounts });  // Send the accounts as the response
    } catch (error) {
        console.error('Error:', error.message);  // Log the error
        res.status(500).json({ message: error.message });  // Send the error message as a response
    }
}

module.exports = { getAccounts };
