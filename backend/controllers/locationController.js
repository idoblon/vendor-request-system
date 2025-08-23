const fs = require("fs");
const path = require("path");

const provincesFilePath = path.join(__dirname, "../data/provinces.json");
const districtsFilePath = path.join(__dirname, "../data/districts.json");

// Helper function to read provinces from JSON file
const readProvinces = () => {
  try {
    const data = fs.readFileSync(provincesFilePath, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading provinces file:", err);
    return [];
  }
};

// Helper function to read districts from JSON file
const readDistricts = () => {
  try {
    const data = fs.readFileSync(districtsFilePath, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading districts file:", err);
    return [];
  }
};

// Helper function to write provinces to JSON file
const writeProvinces = (provinces) => {
  try {
    fs.writeFileSync(
      provincesFilePath,
      JSON.stringify(provinces, null, 2),
      "utf8"
    );
    return true;
  } catch (err) {
    console.error("Error writing provinces file:", err);
    return false;
  }
};

// Helper function to write districts to JSON file
const writeDistricts = (districts) => {
  try {
    fs.writeFileSync(
      districtsFilePath,
      JSON.stringify(districts, null, 2),
      "utf8"
    );
    return true;
  } catch (err) {
    console.error("Error writing districts file:", err);
    return false;
  }
};

// Get all provinces
exports.getAllProvinces = (req, res) => {
  try {
    const provinces = readProvinces();
    res.json(provinces);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Get all districts
exports.getAllDistricts = (req, res) => {
  try {
    const districts = readDistricts();
    const provinces = readProvinces();

    // Add province name to each district
    const districtsWithProvinces = districts.map((district) => {
      const province = provinces.find((p) => p.id === district.provinceId);
      return {
        ...district,
        province: province ? { name: province.name } : null,
      };
    });

    res.json(districtsWithProvinces);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Get districts by province
exports.getDistrictsByProvince = (req, res) => {
  try {
    const provinceId = req.params.provinceId;
    const districts = readDistricts();

    // Filter districts by province ID
    const filteredDistricts = districts.filter(
      (district) => district.provinceId === provinceId
    );

    res.json(filteredDistricts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Add a new province
exports.addProvince = (req, res) => {
  try {
    const { name } = req.body;
    const provinces = readProvinces();

    // Check if province already exists
    if (provinces.some((p) => p.name === name)) {
      return res.status(400).json({ msg: "Province already exists" });
    }

    // Generate a new ID
    const newId =
      provinces.length > 0
        ? (Math.max(...provinces.map((p) => parseInt(p.id))) + 1).toString()
        : "1";

    const newProvince = { id: newId, name };
    provinces.push(newProvince);

    if (writeProvinces(provinces)) {
      res.json(newProvince);
    } else {
      res.status(500).send("Error saving province");
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Add a new district
exports.addDistrict = (req, res) => {
  try {
    const { name, provinceId } = req.body;
    const provinces = readProvinces();
    const districts = readDistricts();

    // Check if province exists
    if (!provinces.some((p) => p.id === provinceId)) {
      return res.status(404).json({ msg: "Province not found" });
    }

    // Check if district already exists in this province
    if (districts.some((d) => d.name === name && d.provinceId === provinceId)) {
      return res
        .status(400)
        .json({ msg: "District already exists in this province" });
    }

    // Generate a new ID
    const newId =
      districts.length > 0
        ? (Math.max(...districts.map((d) => parseInt(d.id))) + 1).toString()
        : "1";

    const newDistrict = { id: newId, name, provinceId };
    districts.push(newDistrict);

    if (writeDistricts(districts)) {
      res.json(newDistrict);
    } else {
      res.status(500).send("Error saving district");
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Seed provinces and districts data
exports.seedLocationData = (req, res) => {
  try {
    // Nepal provinces and districts data
    const provincesData = [
      "Province 1",
      "Madhesh Province",
      "Bagmati Province",
      "Gandaki Province",
      "Lumbini Province",
      "Karnali Province",
      "Sudurpashchim Province",
    ];

    const districtsData = {
      "Province 1": [
        "Bhojpur",
        "Dhankuta",
        "Ilam",
        "Jhapa",
        "Khotang",
        "Morang",
        "Okhaldhunga",
        "Panchthar",
        "Sankhuwasabha",
        "Solukhumbu",
        "Sunsari",
        "Taplejung",
        "Terhathum",
        "Udayapur",
      ],
      "Madhesh Province": [
        "Bara",
        "Dhanusha",
        "Mahottari",
        "Parsa",
        "Rautahat",
        "Saptari",
        "Sarlahi",
        "Siraha",
      ],
      "Bagmati Province": [
        "Bhaktapur",
        "Chitwan",
        "Dhading",
        "Dolakha",
        "Kathmandu",
        "Kavrepalanchok",
        "Lalitpur",
        "Makwanpur",
        "Nuwakot",
        "Ramechhap",
        "Rasuwa",
        "Sindhuli",
        "Sindhupalchok",
      ],
      "Gandaki Province": [
        "Baglung",
        "Gorkha",
        "Kaski",
        "Lamjung",
        "Manang",
        "Mustang",
        "Myagdi",
        "Nawalparasi East",
        "Parbat",
        "Syangja",
        "Tanahun",
      ],
      "Lumbini Province": [
        "Arghakhanchi",
        "Banke",
        "Bardiya",
        "Dang",
        "Gulmi",
        "Kapilvastu",
        "Nawalparasi West",
        "Palpa",
        "Pyuthan",
        "Rolpa",
        "Rukum East",
        "Rupandehi",
      ],
      "Karnali Province": [
        "Dailekh",
        "Dolpa",
        "Humla",
        "Jajarkot",
        "Jumla",
        "Kalikot",
        "Mugu",
        "Rukum West",
        "Salyan",
        "Surkhet",
      ],
      "Sudurpashchim Province": [
        "Achham",
        "Baitadi",
        "Bajhang",
        "Bajura",
        "Dadeldhura",
        "Darchula",
        "Doti",
        "Kailali",
        "Kanchanpur",
      ],
    };

    // Create provinces array with IDs
    const provinces = provincesData.map((name, index) => ({
      id: (index + 1).toString(),
      name,
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
          provinceId,
        });
        districtId++;
      }
    }

    // Write data to files
    if (writeProvinces(provinces) && writeDistricts(districts)) {
      res.json({ message: "Location data seeded successfully" });
    } else {
      res.status(500).send("Error seeding location data");
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
