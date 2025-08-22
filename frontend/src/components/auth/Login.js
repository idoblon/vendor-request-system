import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Alert, Modal } from "react-bootstrap";
import { AuthContext } from "../../context/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showModal, setShowModal] = useState(false);
  const { email, password } = formData;
  const { login, isAuthenticated, error, user, clearError } =
    useContext(AuthContext);
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

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    clearError();
    await login(formData);
  };

  const handleRoleSelect = (role) => {
    setShowModal(false);
    navigate("/register", { state: { selectedRole: role } });
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <div className="card">
          <div className="card-body">
            <h2 className="text-center mb-4">Login</h2>

            {error && <Alert variant="danger">{error}</Alert>}

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

              <Button variant="primary" type="submit" className="w-100">
                Login
              </Button>
            </Form>

            <div className="text-center mt-4">
              <p className="mb-2">Don't have an account?</p>
              <Button
                variant="outline-primary"
                className="w-100"
                onClick={() => setShowModal(true)}
              >
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Role Selection Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Select Registration Type</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-muted mb-3">Please select the type of account you want to create:</p>
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

export default Login;
