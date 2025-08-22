const fs = require('fs');
const path = require('path');

// Define file paths
const dataDir = path.join(__dirname, 'data');
const provincesFilePath = path.join(dataDir, 'provinces.json');
const districtsFilePath = path.join(dataDir, 'districts.json');
const bankDetailsFilePath = path.join(dataDir, 'bankDetails.json');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log('Created data directory');
}

// Helper functions to write data to JSON files
const writeProvinces = (provinces) => {
  try {
    fs.writeFileSync(provincesFilePath, JSON.stringify(provinces, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error writing provinces file:', err);
    return false;
  }
};

const writeDistricts = (districts) => {
  try {
    fs.writeFileSync(districtsFilePath, JSON.stringify(districts, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error writing districts file:', err);
    return false;
  }
};

const writeBankDetails = (bankDetails) => {
  try {
    fs.writeFileSync(bankDetailsFilePath, JSON.stringify(bankDetails, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error writing bank details file:', err);
    return false;
  }
};

// Seed provinces and districts data
const seedLocationData = () => {
  try {
    // Nepal provinces and districts data
    const provincesData = [
      'Province 1',
      'Madhesh Province',
      'Bagmati Province',
      'Gandaki Province',
      'Lumbini Province',
      'Karnali Province',
      'Sudurpashchim Province'
    ];

    const districtsData = {
      'Province 1': ['Bhojpur', 'Dhankuta', 'Ilam', 'Jhapa', 'Khotang', 'Morang', 'Okhaldhunga', 'Panchthar', 'Sankhuwasabha', 'Solukhumbu', 'Sunsari', 'Taplejung', 'Terhathum', 'Udayapur'],
      'Madhesh Province': ['Bara', 'Dhanusha', 'Mahottari', 'Parsa', 'Rautahat', 'Saptari', 'Sarlahi', 'Siraha'],
      'Bagmati Province': ['Bhaktapur', 'Chitwan', 'Dhading', 'Dolakha', 'Kathmandu', 'Kavrepalanchok', 'Lalitpur', 'Makwanpur', 'Nuwakot', 'Ramechhap', 'Rasuwa', 'Sindhuli', 'Sindhupalchok'],
      'Gandaki Province': ['Baglung', 'Gorkha', 'Kaski', 'Lamjung', 'Manang', 'Mustang', 'Myagdi', 'Nawalparasi East', 'Parbat', 'Syangja', 'Tanahun'],
      'Lumbini Province': ['Arghakhanchi', 'Banke', 'Bardiya', 'Dang', 'Gulmi', 'Kapilvastu', 'Nawalparasi West', 'Palpa', 'Pyuthan', 'Rolpa', 'Rukum East', 'Rupandehi'],
      'Karnali Province': ['Dailekh', 'Dolpa', 'Humla', 'Jajarkot', 'Jumla', 'Kalikot', 'Mugu', 'Rukum West', 'Salyan', 'Surkhet'],
      'Sudurpashchim Province': ['Achham', 'Baitadi', 'Bajhang', 'Bajura', 'Dadeldhura', 'Darchula', 'Doti', 'Kailali', 'Kanchanpur']
    };

    // Create provinces array with IDs
    const provinces = provincesData.map((name, index) => ({
      id: (index + 1).toString(),
      name
    }));

    // Create districts array with province references
    let districtId = 1;
    const districts = [];

    for (const [provinceName, districtNames] of Object.entries(districtsData)) {
      const provinceId = (provincesData.indexOf(provinceName) + 1).toString();
      
      for (const districtName of districtNames) {
        districts.push({
          id: districtId.toString(),
          name: districtName,
          provinceId
        });
        districtId++;
      }
    }

    // Write data to files
    if (writeProvinces(provinces) && writeDistricts(districts)) {
      console.log('Location data seeded successfully');
      return true;
    } else {
      console.error('Error seeding location data');
      return false;
    }
  } catch (err) {
    console.error('Error seeding location data:', err);
    return false;
  }
};

// Seed bank details data
const seedBankDetailsData = () => {
  try {
    const bankDetails = [
      {
        id: "1",
        bankName: "Nepal Bank Limited",
        branch: "",  // This will be filled by user input
        accountNumber: "0123456789",
        accountHolderName: "Example Account"
      },
      {
        id: "2",
        bankName: "Rastriya Banijya Bank",
        branch: "",  // This will be filled by user input
        accountNumber: "9876543210",
        accountHolderName: "Sample Account"
      },
      {
        id: "3",
        bankName: "NIC Asia Bank",
        branch: "",  // This will be filled by user input
        accountNumber: "5678901234",
        accountHolderName: "Test Account"
      }
    ];

    if (writeBankDetails(bankDetails)) {
      console.log('Bank details data seeded successfully');
      return true;
    } else {
      console.error('Error seeding bank details data');
      return false;
    }
  } catch (err) {
    console.error('Error seeding bank details data:', err);
    return false;
  }
};

// Run the seed functions
const seedAll = () => {
  const locationSuccess = seedLocationData();
  const bankDetailsSuccess = seedBankDetailsData();

  if (locationSuccess && bankDetailsSuccess) {
    console.log('All data seeded successfully');
  } else {
    console.error('Error seeding some data');
  }
};

// Execute the seed function
seedAll();