const fs = require('fs');
const path = require('path');

const bankDetailsFilePath = path.join(__dirname, '../data/bankDetails.json');

// Helper function to read bank details from JSON file
const readBankDetails = () => {
  try {
    const data = fs.readFileSync(bankDetailsFilePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading bank details file:', err);
    return [];
  }
};

// Helper function to write bank details to JSON file
const writeBankDetails = (bankDetails) => {
  try {
    fs.writeFileSync(bankDetailsFilePath, JSON.stringify(bankDetails, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error writing bank details file:', err);
    return false;
  }
};

// Get all bank details
exports.getAllBankDetails = (req, res) => {
  try {
    const bankDetails = readBankDetails();
    res.json(bankDetails);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Add a new bank detail
exports.addBankDetail = (req, res) => {
  try {
    const { bankName, branch, accountNumber, accountHolderName } = req.body;
    
    const bankDetails = readBankDetails();
    
    // Generate a new ID (simple implementation)
    const newId = bankDetails.length > 0 
      ? (Math.max(...bankDetails.map(b => parseInt(b.id))) + 1).toString()
      : "1";
    
    const newBankDetail = {
      id: newId,
      bankName,
      branch,
      accountNumber,
      accountHolderName
    };
    
    bankDetails.push(newBankDetail);
    
    if (writeBankDetails(bankDetails)) {
      res.json(newBankDetail);
    } else {
      res.status(500).send("Error saving bank detail");
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};