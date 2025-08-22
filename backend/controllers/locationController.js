const Province = require("../models/Province");
const District = require("../models/District");

// Get all provinces
exports.getAllProvinces = async (req, res) => {
  try {
    const provinces = await Province.find();
    res.json(provinces);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Get all districts
exports.getAllDistricts = async (req, res) => {
  try {
    const districts = await District.find().populate("province", "name");
    res.json(districts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Get districts by province
exports.getDistrictsByProvince = async (req, res) => {
  try {
    const districts = await District.find({ province: req.params.provinceId });
    res.json(districts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Add a new province
exports.addProvince = async (req, res) => {
  try {
    const { name } = req.body;

    // Check if province already exists
    let province = await Province.findOne({ name });
    if (province) {
      return res.status(400).json({ msg: "Province already exists" });
    }

    province = new Province({ name });
    await province.save();

    res.json(province);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Add a new district
exports.addDistrict = async (req, res) => {
  try {
    const { name, provinceId } = req.body;

    // Check if province exists
    const province = await Province.findById(provinceId);
    if (!province) {
      return res.status(404).json({ msg: "Province not found" });
    }

    // Check if district already exists in this province
    let district = await District.findOne({ name, province: provinceId });
    if (district) {
      return res.status(400).json({ msg: "District already exists in this province" });
    }

    district = new District({
      name,
      province: provinceId
    });

    await district.save();

    res.json(district);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Seed provinces and districts data
exports.seedLocationData = async (req, res) => {
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

    // Clear existing data
    await Province.deleteMany({});
    await District.deleteMany({});

    // Insert provinces and get their IDs
    const provinceMap = {};
    for (const provinceName of provincesData) {
      const province = new Province({ name: provinceName });
      await province.save();
      provinceMap[provinceName] = province._id;
    }

    // Insert districts with province references
    for (const [provinceName, districts] of Object.entries(districtsData)) {
      const provinceId = provinceMap[provinceName];
      
      for (const districtName of districts) {
        const district = new District({
          name: districtName,
          province: provinceId
        });
        await district.save();
      }
    }

    res.json({ message: "Location data seeded successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};