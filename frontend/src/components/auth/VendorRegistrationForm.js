import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Alert, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaUser,
  FaBuilding,
  FaUniversity,
  FaFileAlt,
  FaInfoCircle,
} from "react-icons/fa";

const VendorRegistrationForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fileSelected, setFileSelected] = useState(false);
  const [fileName, setFileName] = useState("");
  const [districts, setDistricts] = useState([]);
  const [banks, setBanks] = useState([]);

  const [formData, setFormData] = useState({
    businessName: "",
    pan: "",
    email: "",
    password: "", // Add password field
    phone: "",
    province: "",
    district: "",
    contactPerson1: {
      name: "",
      phone: "",
    },
    contactPerson2: {
      name: "",
      phone: "",
    },
    bankDetails: {
      bankName: "",
      accountNumber: "",
      branch: "",
      accountHolderName: "",
    },
    panDocument: null,
    applicationType: "vendor",
  });

  // List of provinces in Nepal
  const provinces = [
    { id: "1", name: "Province 1" },
    { id: "2", name: "Madhesh Province" },
    { id: "3", name: "Bagmati Province" },
    { id: "4", name: "Gandaki Province" },
    { id: "5", name: "Lumbini Province" },
    { id: "6", name: "Karnali Province" },
    { id: "7", name: "Sudurpashchim Province" },
  ];

  // Fetch districts when province changes
  useEffect(() => {
    const fetchDistricts = async () => {
      if (formData.province) {
        try {
          const res = await axios.get(
            `/api/locations/provinces/${formData.province}/districts`
          );
          setDistricts(res.data);
        } catch (err) {
          console.error("Error fetching districts:", err);
        }
      } else {
        setDistricts([]);
      }
    };

    fetchDistricts();
  }, [formData.province]);

  // Add this useEffect to fetch banks
  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const res = await axios.get("/api/bank-details");
        setBanks(res.data);
      } catch (err) {
        console.error("Error fetching banks:", err);
      }
    };

    fetchBanks();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle nested objects
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        panDocument: file,
      });
      setFileSelected(true);
      setFileName(file.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Validate form data
    if (
      !formData.businessName ||
      !formData.pan ||
      !formData.email ||
      !formData.password ||
      !formData.phone ||
      !formData.province ||
      !formData.district ||
      !formData.contactPerson1.name ||
      !formData.contactPerson1.phone ||
      !formData.bankDetails.bankName ||
      !formData.bankDetails.accountNumber ||
      !formData.bankDetails.branch ||
      !formData.bankDetails.accountHolderName ||
      !formData.panDocument
    ) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    // Validate PAN format (assuming PAN is a 9-digit number in Nepal)
    const panRegex = /^[0-9]{9}$/;
    if (!panRegex.test(formData.pan)) {
      setError("PAN must be a 9-digit number");
      setLoading(false);
      return;
    }

    // Validate email format (improved regex for better validation)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    // Validate password strength
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      setError(
        "Password must be at least 8 characters and include uppercase, lowercase, number and special character"
      );
      setLoading(false);
      return;
    }

    // Validate Nepali bank account number (typically 10-16 digits)
    const accountNumberRegex = /^[0-9]{10,16}$/;
    if (!accountNumberRegex.test(formData.bankDetails.accountNumber)) {
      setError("Bank account number must be 10-16 digits");
      setLoading(false);
      return;
    }

    // Validate phone number (assuming 10-digit number for Nepal)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError("Phone number must be a 10-digit number");
      setLoading(false);
      return;
    }

    // Create form data for file upload
    const submitData = new FormData();
    for (const key in formData) {
      if (
        key === "contactPerson1" ||
        key === "contactPerson2" ||
        key === "bankDetails"
      ) {
        submitData.append(key, JSON.stringify(formData[key]));
      } else if (key === "panDocument" && formData[key]) {
        submitData.append("panDocument", formData[key]);
      } else {
        submitData.append(key, formData[key]);
      }
    }

    try {
      const res = await axios.post("/api/applications", submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess(
        "Your vendor application has been submitted successfully! We will review your application and get back to you soon."
      );

      // Reset form after successful submission
      setFormData({
        businessName: "",
        pan: "",
        email: "",
        password: "",
        phone: "",
        province: "",
        district: "",
        contactPerson1: {
          name: "",
          phone: "",
        },
        contactPerson2: {
          name: "",
          phone: "",
        },
        bankDetails: {
          bankName: "",
          accountNumber: "",
          branch: "",
          accountHolderName: "",
        },
        panDocument: null,
        applicationType: "vendor",
      });
      setFileSelected(false);
      setFileName("");

      // Redirect to dashboard after 3 seconds
      setTimeout(() => {
        navigate("/vendor/dashboard");
      }, 3000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "An error occurred while submitting your application"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container mx-auto p-3">
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Card className="mb-4 border-0 shadow-sm bg-white">
          <Card.Body className="p-3">
            <div className="form-section mb-4 bg-white">
              <div className="section-header">
                <i>
                  <FaBuilding size={20} />
                </i>
                <h5>Vendor Information</h5>
              </div>
              <Row className="form-row">
                <Col md={6} className="form-field-container">
                  <Form.Group className="mb-3">
                    <Form.Label>Business Name *</Form.Label>
                    <Form.Control
                      type="text"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleChange}
                      placeholder="Enter business name"
                      required
                      className="form-control-lg"
                    />
                  </Form.Group>
                </Col>
                <Col md={6} className="form-field-container">
                  <Form.Group className="mb-3">
                    <Form.Label>PAN Number *</Form.Label>
                    <Form.Control
                      type="text"
                      name="pan"
                      value={formData.pan}
                      onChange={handleChange}
                      placeholder="Enter 9-digit PAN number"
                      required
                      className="form-control-lg"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="form-row">
                <Col md={6} className="form-field-container">
                  <Form.Group className="mb-3">
                    <Form.Label>Email Address *</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter email address"
                      required
                      className="form-control-lg"
                      isInvalid={
                        formData.email &&
                        !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
                          formData.email
                        )
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter a valid email address
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6} className="form-field-container">
                  <Form.Group className="mb-3">
                    <Form.Label>Password *</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter password"
                      required
                      className="form-control-lg"
                      isInvalid={
                        formData.password &&
                        !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
                          formData.password
                        )
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      Password must be at least 8 characters and include
                      uppercase, lowercase, number and special character
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Row className="form-row">
                <Col md={6} className="form-field-container">
                  <Form.Group className="mb-3">
                    <Form.Label>Phone Number *</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text">+977</span>
                      <Form.Control
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter 10-digit phone number"
                        required
                        className="form-control-lg"
                      />
                    </div>
                  </Form.Group>
                </Col>
              </Row>

              <Row className="form-row">
                <Col md={6} className="form-field-container">
                  <Form.Group className="mb-3">
                    <Form.Label>Province *</Form.Label>
                    <Form.Select
                      name="province"
                      value={formData.province}
                      onChange={handleChange}
                      required
                      className="form-control-lg"
                    >
                      <option value="">Select Province</option>
                      {provinces.map((province) => (
                        <option key={province.id} value={province.id}>
                          {province.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6} className="form-field-container">
                  <Form.Group className="mb-3">
                    <Form.Label>District *</Form.Label>
                    <Form.Select
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                      required
                      className="form-control-lg"
                      disabled={!formData.province}
                    >
                      <option value="">Select District</option>
                      {districts.map((district) => (
                        <option key={district.id} value={district.name}>
                          {district.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </div>

            <div className="form-section mb-4 bg-white">
              <div className="section-header">
                <i>
                  <FaUser size={20} />
                </i>
                <h5>Contact Persons</h5>
              </div>
              <Row className="form-row">
                <Col md={6} className="form-field-container">
                  <Form.Group className="mb-3">
                    <Form.Label>Contact Person 1 Name *</Form.Label>
                    <Form.Control
                      type="text"
                      name="contactPerson1.name"
                      value={formData.contactPerson1.name}
                      onChange={handleChange}
                      placeholder="Enter contact person name"
                      required
                      className="form-control-lg"
                    />
                  </Form.Group>
                </Col>
                <Col md={6} className="form-field-container">
                  <Form.Group className="mb-3">
                    <Form.Label>Contact Person 1 Phone *</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text">+977</span>
                      <Form.Control
                        type="text"
                        name="contactPerson1.phone"
                        value={formData.contactPerson1.phone}
                        onChange={handleChange}
                        placeholder="Enter contact person phone"
                        required
                        className="form-control-lg"
                      />
                    </div>
                  </Form.Group>
                </Col>
              </Row>

              <Row className="form-row">
                <Col md={6} className="form-field-container">
                  <Form.Group className="mb-3">
                    <Form.Label>Contact Person 2 Name (Optional)</Form.Label>
                    <Form.Control
                      type="text"
                      name="contactPerson2.name"
                      value={formData.contactPerson2.name}
                      onChange={handleChange}
                      placeholder="Enter contact person name"
                      className="form-control-lg"
                    />
                  </Form.Group>
                </Col>
                <Col md={6} className="form-field-container">
                  <Form.Group className="mb-3">
                    <Form.Label>Contact Person 2 Phone (Optional)</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text">+977</span>
                      <Form.Control
                        type="text"
                        name="contactPerson2.phone"
                        value={formData.contactPerson2.phone}
                        onChange={handleChange}
                        placeholder="Enter contact person phone"
                        className="form-control-lg"
                      />
                    </div>
                  </Form.Group>
                </Col>
              </Row>
            </div>

            <div className="form-section mb-4 bg-white">
              <div className="section-header">
                <i>
                  <FaUniversity size={20} />
                </i>
                <h5>Bank Details</h5>
              </div>
              <Row className="form-row">
                <Col md={6} className="form-field-container">
                  <Form.Group className="mb-3">
                    <Form.Label>Bank Name *</Form.Label>
                    <Form.Select
                      name="bankDetails.bankName"
                      value={formData.bankDetails.bankName}
                      onChange={handleChange}
                      required
                      className="form-control-lg"
                    >
                      <option value="">Select Bank</option>
                      {banks.map((bank) => (
                        <option key={bank.id} value={bank.bankName}>
                          {bank.bankName}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6} className="form-field-container">
                  <Form.Group className="mb-3">
                    <Form.Label>Account Number *</Form.Label>
                    <Form.Control
                      type="text"
                      name="bankDetails.accountNumber"
                      value={formData.bankDetails.accountNumber}
                      onChange={handleChange}
                      placeholder="Enter account number"
                      required
                      className="form-control-lg"
                      isInvalid={
                        formData.bankDetails.accountNumber &&
                        !/^[0-9]{10,16}$/.test(
                          formData.bankDetails.accountNumber
                        )
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      Bank account number must be 10-16 digits
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Row className="form-row">
                <Col md={6} className="form-field-container">
                  <Form.Group className="mb-3">
                    <Form.Label>Branch *</Form.Label>
                    <Form.Control
                      type="text"
                      name="bankDetails.branch"
                      value={formData.bankDetails.branch}
                      onChange={handleChange}
                      placeholder="Enter branch name"
                      required
                      className="form-control-lg"
                    />
                  </Form.Group>
                </Col>
                <Col md={6} className="form-field-container">
                  <Form.Group className="mb-3">
                    <Form.Label>Account Holder Name *</Form.Label>
                    <Form.Control
                      type="text"
                      name="bankDetails.accountHolderName"
                      value={formData.bankDetails.accountHolderName}
                      onChange={handleChange}
                      placeholder="Enter account holder name"
                      required
                      className="form-control-lg"
                    />
                  </Form.Group>
                </Col>
              </Row>
            </div>

            <div className="form-section mb-4 bg-white">
              <div className="section-header">
                <i>
                  <FaFileAlt size={20} />
                </i>
                <h5>Documents</h5>
              </div>
              <Row className="form-row">
                <Col md={10} className="mx-auto">
                  <Form.Group className="mb-3">
                    <Form.Label>PAN Document *</Form.Label>
                    <div className="upload-box border border-dashed rounded p-4 text-center">
                      <div className="upload-icon mb-2 mx-auto">
                        <FaFileAlt size={24} className="text-primary" />
                      </div>
                      <p className="mb-1">Click to upload or drag and drop</p>
                      <p className="text-muted small">PDF, JPG, JPEG, or PNG</p>
                      <Form.Control
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileChange}
                        required
                        className="d-none"
                        id="file-upload"
                      />
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() =>
                          document.getElementById("file-upload").click()
                        }
                      >
                        Choose File
                      </Button>
                    </div>
                    {fileSelected && (
                      <div className="mt-2 text-center">
                        <span className="text-success">
                          Selected file: {fileName}
                        </span>
                      </div>
                    )}
                  </Form.Group>
                </Col>
              </Row>
            </div>

            <div className="application-process mx-auto bg-white">
              <div className="d-flex align-items-center justify-content-center mb-2">
                <FaInfoCircle className="text-primary me-2" size={18} />
                <h6 className="mb-0 fw-bold">Application Process</h6>
              </div>
              <p className="mb-0 small text-muted text-center">
                Your vendor application will be submitted to the admin for
                review. You will receive an email notification once your
                application is approved or if additional information is
                required.
              </p>
            </div>

            <div className="form-actions d-flex justify-content-center gap-4 mt-4">
              <Button
                variant="danger"
                onClick={() => navigate("/login")}
                className="px-5 py-3 fw-bold shadow-sm rounded-pill"
                size="lg"
              >
                <span className="d-flex align-items-center">
                  <i className="fas fa-times me-2"></i>
                  Cancel
                </span>
              </Button>
              <Button
                variant="success"
                type="submit"
                disabled={loading}
                className="px-5 py-3 fw-bold shadow-sm rounded-pill"
                size="lg"
              >
                <span className="d-flex align-items-center">
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane me-2"></i>
                      Submit Application
                    </>
                  )}
                </span>
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Form>
    </div>
  );
};

export default VendorRegistrationForm;
