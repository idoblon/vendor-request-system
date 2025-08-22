import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Alert, Row, Col } from "react-bootstrap";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

// Nepal provinces and districts
const nepalProvinces = [
  "Province 1",
  "Madhesh Province",
  "Bagmati Province",
  "Gandaki Province",
  "Lumbini Province",
  "Karnali Province",
  "Sudurpashchim Province",
];

const districtsByProvince = {
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
    "Rupandehi",
    "Rukum East",
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

const VendorForm = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    businessName: "",
    pan: "",
    phone: "",
    province: "",
    district: "",
    contactPerson1Name: "",
    contactPerson1Phone: "",
    contactPerson2Name: "",
    contactPerson2Phone: "",
    bankName: "",
    accountNumber: "",
    branch: "",
    accountHolderName: "",
  });

  const [panDocument, setPanDocument] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const {
    businessName,
    pan,
    phone,
    province,
    district,
    contactPerson1Name,
    contactPerson1Phone,
    contactPerson2Name,
    contactPerson2Phone,
    bankName,
    accountNumber,
    branch,
    accountHolderName,
  } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onProvinceChange = (e) => {
    setFormData({
      ...formData,
      province: e.target.value,
      district: "",
    });
  };

  const onFileChange = (e) => {
    setPanDocument(e.target.files[0]);
  };

  const validateNepaliPhone = (phone) => {
    // Nepali phone number format: 98XXXXXXXX or 97XXXXXXXX
    const regex = /^(98|97)\d{8}$/;
    return regex.test(phone);
  };

  const validateNepaliPAN = (pan) => {
    // Nepali PAN format: XXXXXXXXX (9 digits)
    const regex = /^\d{9}$/;
    return regex.test(pan);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate Nepali phone format
    if (!validateNepaliPhone(phone)) {
      setError("Phone number must be in Nepali format (e.g., 9812345678)");
      return;
    }

    if (!validateNepaliPhone(contactPerson1Phone)) {
      setError("Contact Person 1 phone number must be in Nepali format");
      return;
    }

    if (contactPerson2Phone && !validateNepaliPhone(contactPerson2Phone)) {
      setError("Contact Person 2 phone number must be in Nepali format");
      return;
    }

    // Validate Nepali PAN format
    if (!validateNepaliPAN(pan)) {
      setError("PAN must be in Nepali format (9 digits)");
      return;
    }

    // Check if PAN document is uploaded
    if (!panDocument) {
      setError("PAN document is required");
      return;
    }

    try {
      setLoading(true);

      const formDataToSend = new FormData();
      formDataToSend.append("businessName", businessName);
      formDataToSend.append("pan", pan);
      formDataToSend.append("phone", phone);
      formDataToSend.append("province", province);
      formDataToSend.append("district", district);
      formDataToSend.append("contactPerson1Name", contactPerson1Name);
      formDataToSend.append("contactPerson1Phone", contactPerson1Phone);

      if (contactPerson2Name && contactPerson2Phone) {
        formDataToSend.append("contactPerson2Name", contactPerson2Name);
        formDataToSend.append("contactPerson2Phone", contactPerson2Phone);
      }

      formDataToSend.append("bankName", bankName);
      formDataToSend.append("accountNumber", accountNumber);
      formDataToSend.append("branch", branch);
      formDataToSend.append("accountHolderName", accountHolderName);
      formDataToSend.append("panDocument", panDocument);

      await axios.post("/api/vendors", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/vendor/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Error submitting form");
    } finally {
      setLoading(false);
    }
  };

  const onCancel = () => {
    navigate("/login");
  };

  return (
    <div className="card">
      <div className="card-body">
        <h2 className="text-center mb-4">
          {user?.role === "center" ? "Center" : "Vendor"} Registration Form
        </h2>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={onSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Business Name</Form.Label>
            <Form.Control
              type="text"
              name="businessName"
              value={businessName}
              onChange={onChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>PAN Number (9 digits)</Form.Label>
            <Form.Control
              type="text"
              name="pan"
              value={pan}
              onChange={onChange}
              required
              placeholder="123456789"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="text"
              name="phone"
              value={phone}
              onChange={onChange}
              required
              placeholder="9812345678"
            />
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Province</Form.Label>
                <Form.Select
                  name="province"
                  value={province}
                  onChange={onProvinceChange}
                  required
                >
                  <option value="">Select Province</option>
                  {nepalProvinces.map((prov) => (
                    <option key={prov} value={prov}>
                      {prov}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>District</Form.Label>
                <Form.Select
                  name="district"
                  value={district}
                  onChange={onChange}
                  required
                  disabled={!province}
                >
                  <option value="">Select District</option>
                  {province &&
                    districtsByProvince[province].map((dist) => (
                      <option key={dist} value={dist}>
                        {dist}
                      </option>
                    ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <h4 className="mt-4">Contact Person 1</h4>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="contactPerson1Name"
                  value={contactPerson1Name}
                  onChange={onChange}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="text"
                  name="contactPerson1Phone"
                  value={contactPerson1Phone}
                  onChange={onChange}
                  required
                  placeholder="9812345678"
                />
              </Form.Group>
            </Col>
          </Row>

          <h4 className="mt-4">Contact Person 2 (Optional)</h4>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="contactPerson2Name"
                  value={contactPerson2Name}
                  onChange={onChange}
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="text"
                  name="contactPerson2Phone"
                  value={contactPerson2Phone}
                  onChange={onChange}
                  placeholder="9812345678"
                />
              </Form.Group>
            </Col>
          </Row>

          <h4 className="mt-4">Bank Details</h4>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Bank Name</Form.Label>
                <Form.Control
                  type="text"
                  name="bankName"
                  value={bankName}
                  onChange={onChange}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Account Number</Form.Label>
                <Form.Control
                  type="text"
                  name="accountNumber"
                  value={accountNumber}
                  onChange={onChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Branch</Form.Label>
                <Form.Control
                  type="text"
                  name="branch"
                  value={branch}
                  onChange={onChange}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Account Holder Name</Form.Label>
                <Form.Control
                  type="text"
                  name="accountHolderName"
                  value={accountHolderName}
                  onChange={onChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Upload PAN Document</Form.Label>
            <Form.Control
              type="file"
              onChange={onFileChange}
              required
              accept=".pdf,.jpg,.jpeg,.png"
            />
            <Form.Text className="text-muted">
              Accepted formats: PDF, JPG, JPEG, PNG (Max size: 5MB)
            </Form.Text>
          </Form.Group>

          <div className="d-flex justify-content-between mt-4">
            <Button variant="secondary" onClick={onCancel}>
              Cancel
            </Button>

            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit Application"}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default VendorForm;
