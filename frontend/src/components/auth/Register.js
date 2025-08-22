import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Form, Button, Alert, Card, Modal } from "react-bootstrap";
import { AuthContext } from "../../context/AuthContext";

const Register = () => {
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    role: location.state?.selectedRole || ""
  });
  
  const [showModal, setShowModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { register, isAuthenticated, error, user, clearError } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === "admin") {
        navigate("/admin/dashboard");
      } else if (user?.role === "vendor") {
        navigate("/vendor/dashboard");
      } else if (user?.role === "center") {
        navigate("/center/dashboard");
      }
    }
  }, [isAuthenticated, navigate, user]);

  const { email, password, confirmPassword, role } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    clearError();
    
    if (password !== confirmPassword) {
      setSuccessMessage("");
      return;
    }
    
    const success = await register(formData);
    if (success) {
      setSuccessMessage(
        `Registration successful! You are now registered as a ${role === "vendor" ? "Vendor" : "Center"}. You can now log in with your credentials.`
      );
      // Clear form after successful registration
      setFormData({
        email: "",
        password: "",
        confirmPassword: "",
        role: ""
      });
    }
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setFormData({ ...formData, role });
    setShowModal(false);
  };

  const getRoleDescription = (roleType) => {
    if (roleType === "vendor") {
      return "As a Vendor, you can submit applications to centers and track their status.";
    } else if (roleType === "center") {
      return "As a Center, you can review and manage vendor applications.";
    }
    return "";
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <Card>
          <Card.Body>
            <h2 className="text-center mb-4">Register {role && `as ${role === "vendor" ? "Vendor" : "Center"}`}</h2>
            
            {error && <Alert variant="danger">{error}</Alert>}
            {successMessage && <Alert variant="success">{successMessage}</Alert>}
            
            <Form onSubmit={onSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={email}
                  onChange={onChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={password}
                  onChange={onChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={onChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Register as</Form.Label>
                <Form.Select
                  name="role"
                  value={role}
                  onChange={onChange}
                  required
                >
                  <option value="">Select role</option>
                  <option value="vendor">Vendor</option>
                  <option value="center">Center</option>
                </Form.Select>
                {role && (
                  <Form.Text className="text-muted">
                    {getRoleDescription(role)}
                  </Form.Text>
                )}
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100 mt-3">
                Register
              </Button>
            </Form>

            <div className="text-center mt-3">
              <p>
                Already have an account? <a href="/login">Login</a>
              </p>
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Role Selection Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Select Registration Type</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-grid gap-3">
            <Button 
              variant="outline-primary" 
              size="lg" 
              onClick={() => handleRoleSelect("vendor")}
            >
              Register as Vendor
              <div className="small mt-1 text-muted">
                Submit applications to centers and track their status
              </div>
            </Button>
            <Button 
              variant="outline-success" 
              size="lg" 
              onClick={() => handleRoleSelect("center")}
            >
              Register as Center
              <div className="small mt-1 text-muted">
                Review and manage vendor applications
              </div>
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Register;