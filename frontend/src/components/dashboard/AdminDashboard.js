import React, { useState, useEffect } from "react";
import { Card, Table, Badge, Button, Modal } from "react-bootstrap";
import axios from "axios";

const AdminDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await axios.get("/api/applications");
      setApplications(res.data);
      setLoading(false);
    } catch (err) {
      setError("Error fetching applications");
      setLoading(false);
    }
  };

  const handleViewDetails = (application) => {
    setSelectedApplication(application);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedApplication(null);
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await axios.put(`/api/applications/${id}`, { status });
      fetchApplications();
      setShowModal(false);
    } catch (err) {
      setError("Error updating application status");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <Badge bg="warning">Pending</Badge>;
      case "approved":
        return <Badge bg="success">Approved</Badge>;
      case "rejected":
        return <Badge bg="danger">Rejected</Badge>;
      default:
        return <Badge bg="secondary">Unknown</Badge>;
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div>
      <h2 className="mb-4">Admin Dashboard</h2>
      <Card>
        <Card.Header>
          <h3>Vendor/Center Applications</h3>
        </Card.Header>
        <Card.Body>
          {applications.length === 0 ? (
            <p>No applications found.</p>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Business Name</th>
                  <th>Type</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Submitted On</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app._id}>
                    <td>{app.businessName}</td>
                    <td>
                      {app.applicationType === "vendor" ? "Vendor" : "Center"}
                    </td>
                    <td>{app.email}</td>
                    <td>{getStatusBadge(app.status)}</td>
                    <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                    <td>
                      <Button
                        variant="info"
                        size="sm"
                        onClick={() => handleViewDetails(app)}
                      >
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Application Details Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        {selectedApplication && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>Application Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <h5>Business Information</h5>
              <Table bordered>
                <tbody>
                  <tr>
                    <td>
                      <strong>Business Name</strong>
                    </td>
                    <td>{selectedApplication.businessName}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Type</strong>
                    </td>
                    <td>
                      {selectedApplication.applicationType === "vendor"
                        ? "Vendor"
                        : "Center"}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>PAN</strong>
                    </td>
                    <td>{selectedApplication.pan}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Email</strong>
                    </td>
                    <td>{selectedApplication.email}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Phone</strong>
                    </td>
                    <td>{selectedApplication.phone}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Location</strong>
                    </td>
                    <td>
                      {selectedApplication.district},{" "}
                      {selectedApplication.province}
                    </td>
                  </tr>
                </tbody>
              </Table>

              <h5 className="mt-4">Contact Persons</h5>
              <Table bordered>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Phone</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{selectedApplication.contactPerson1.name}</td>
                    <td>{selectedApplication.contactPerson1.phone}</td>
                  </tr>
                  {selectedApplication.contactPerson2 &&
                    selectedApplication.contactPerson2.name && (
                      <tr>
                        <td>{selectedApplication.contactPerson2.name}</td>
                        <td>{selectedApplication.contactPerson2.phone}</td>
                      </tr>
                    )}
                </tbody>
              </Table>

              <h5 className="mt-4">Bank Details</h5>
              <Table bordered>
                <tbody>
                  <tr>
                    <td>
                      <strong>Bank Name</strong>
                    </td>
                    <td>{selectedApplication.bankDetails.bankName}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Account Number</strong>
                    </td>
                    <td>{selectedApplication.bankDetails.accountNumber}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Branch</strong>
                    </td>
                    <td>{selectedApplication.bankDetails.branch}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Account Holder</strong>
                    </td>
                    <td>{selectedApplication.bankDetails.accountHolderName}</td>
                  </tr>
                </tbody>
              </Table>

              <h5 className="mt-4">Documents</h5>
              <p>
                <a
                  href={`/uploads/${selectedApplication.panDocument
                    .split("/")
                    .pop()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View PAN Document
                </a>
              </p>

              <h5 className="mt-4">Status</h5>
              <p>{getStatusBadge(selectedApplication.status)}</p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                Close
              </Button>
              {selectedApplication.status === "pending" && (
                <>
                  <Button
                    variant="success"
                    onClick={() =>
                      handleUpdateStatus(selectedApplication._id, "approved")
                    }
                  >
                    Approve
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() =>
                      handleUpdateStatus(selectedApplication._id, "rejected")
                    }
                  >
                    Reject
                  </Button>
                </>
              )}
            </Modal.Footer>
          </>
        )}
      </Modal>
    </div>
  );
};

export default AdminDashboard;
