import React, { useState, useEffect, useContext } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Badge,
  Modal,
  Form,
  Nav,
  Dropdown,
  Alert,
} from "react-bootstrap";
import {
  FaUsers,
  FaUserTie,
  FaBuilding,
  FaEnvelope,
  FaBell,
  FaSignOutAlt,
  FaChartLine,
} from "react-icons/fa";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("overview");
  const [vendors, setVendors] = useState([]);
  const [centers, setCenters] = useState([]);
  const [applications, setApplications] = useState([]);
  const [messages, setMessages] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [messageRecipient, setMessageRecipient] = useState("");
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [stats, setStats] = useState({
    totalVendors: 0,
    totalCenters: 0,
    pendingApplications: 0,
    totalCommission: 0,
  });

  useEffect(() => {
    if (activeTab === "overview") {
      fetchStats();
    } else if (activeTab === "applications") {
      fetchApplications();
    } else if (activeTab === "vendors") {
      fetchVendors();
    } else if (activeTab === "centers") {
      fetchCenters();
    } else if (activeTab === "messages") {
      fetchMessages();
    }

    fetchNotifications();
  }, [activeTab]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      // In a real application, you would fetch this data from your API
      // For now, we'll simulate it with mock data
      setStats({
        totalVendors: 12,
        totalCenters: 8,
        pendingApplications: 5,
        totalCommission: 25000,
      });
      setLoading(false);
    } catch (err) {
      setError("Failed to load statistics");
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/applications");
      setApplications(res.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load applications");
      setLoading(false);
    }
  };

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/admin/vendors");
      setVendors(res.data.filter((v) => v.user.role === "vendor"));
      setLoading(false);
    } catch (err) {
      setError("Failed to load vendors");
      setLoading(false);
    }
  };

  const fetchCenters = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/admin/vendors");
      setCenters(res.data.filter((v) => v.user.role === "center"));
      setLoading(false);
    } catch (err) {
      setError("Failed to load centers");
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      setLoading(true);
      // In a real application, you would fetch messages from your API
      // For now, we'll simulate it with mock data
      setMessages([
        {
          id: 1,
          sender: { name: "ABC Vendor", role: "vendor" },
          message: "Need help with my application",
          date: new Date(),
          read: false,
        },
        {
          id: 2,
          sender: { name: "XYZ Center", role: "center" },
          message: "When will my application be approved?",
          date: new Date(Date.now() - 86400000),
          read: true,
        },
      ]);
      setUnreadMessages(1);
      setLoading(false);
    } catch (err) {
      setError("Failed to load messages");
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      // In a real application, you would fetch notifications from your API
      // For now, we'll simulate it with mock data
      setNotifications([
        {
          id: 1,
          message: "New vendor application received",
          date: new Date(),
          read: false,
        },
        {
          id: 2,
          message: "New center application received",
          date: new Date(Date.now() - 86400000),
          read: false,
        },
        {
          id: 3,
          message: "New message from ABC Vendor",
          date: new Date(Date.now() - 172800000),
          read: true,
        },
      ]);
      setUnreadNotifications(2);
    } catch (err) {
      console.error("Failed to load notifications", err);
    }
  };

  const handleViewDetails = (item, type) => {
    if (type === "vendor") {
      setSelectedVendor(item);
      setSelectedCenter(null);
    } else {
      setSelectedCenter(item);
      setSelectedVendor(null);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedVendor(null);
    setSelectedCenter(null);
  };

  const handleApprove = async (id, type) => {
    try {
      await axios.put(
        `/api/admin/${type === "vendor" ? "vendors" : "centers"}/${id}`,
        { status: "approved" }
      );
      if (type === "vendor") {
        fetchVendors();
      } else {
        fetchCenters();
      }
      if (
        (selectedVendor && selectedVendor._id === id) ||
        (selectedCenter && selectedCenter._id === id)
      ) {
        handleCloseModal();
      }
    } catch (err) {
      setError(`Failed to approve ${type}`);
    }
  };

  const handleReject = async (id, type) => {
    try {
      await axios.put(
        `/api/admin/${type === "vendor" ? "vendors" : "centers"}/${id}`,
        { status: "rejected" }
      );
      if (type === "vendor") {
        fetchVendors();
      } else {
        fetchCenters();
      }
      if (
        (selectedVendor && selectedVendor._id === id) ||
        (selectedCenter && selectedCenter._id === id)
      ) {
        handleCloseModal();
      }
    } catch (err) {
      setError(`Failed to reject ${type}`);
    }
  };

  const handleSuspend = async (id, type) => {
    try {
      // In a real application, you would implement this endpoint
      await axios.put(
        `/api/admin/${type === "vendor" ? "vendors" : "centers"}/${id}/suspend`
      );
      if (type === "vendor") {
        fetchVendors();
      } else {
        fetchCenters();
      }
    } catch (err) {
      setError(`Failed to suspend ${type}`);
    }
  };

  const handleDelete = async (id, type) => {
    try {
      // In a real application, you would implement this endpoint
      await axios.delete(
        `/api/admin/${type === "vendor" ? "vendors" : "centers"}/${id}`
      );
      if (type === "vendor") {
        fetchVendors();
      } else {
        fetchCenters();
      }
    } catch (err) {
      setError(`Failed to delete ${type}`);
    }
  };

  const handleSendMessage = async () => {
    try {
      // In a real application, you would implement this endpoint
      await axios.post("/api/messages", {
        recipient: messageRecipient,
        message: messageText,
      });
      setMessageText("");
      setMessageRecipient("");
      setShowMessageModal(false);
      fetchMessages();
    } catch (err) {
      setError("Failed to send message");
    }
  };

  const markNotificationAsRead = async (id) => {
    try {
      // In a real application, you would implement this endpoint
      await axios.put(`/api/notifications/${id}/read`);
      setNotifications(
        notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      setUnreadNotifications(unreadNotifications - 1);
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  const markMessageAsRead = async (id) => {
    try {
      // In a real application, you would implement this endpoint
      await axios.put(`/api/messages/${id}/read`);
      setMessages(
        messages.map((m) => (m.id === id ? { ...m, read: true } : m))
      );
      setUnreadMessages(unreadMessages - 1);
    } catch (err) {
      console.error("Failed to mark message as read", err);
    }
  };

  if (loading && activeTab !== "messages") {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  const renderOverview = () => (
    <Row>
      <Col md={3}>
        <Card className="mb-4 text-center">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h5 className="mb-0">Total Vendors</h5>
                <h2 className="mt-3">{stats.totalVendors}</h2>
              </div>
              <div className="bg-primary p-3 rounded-circle">
                <FaUserTie size={30} color="white" />
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col md={3}>
        <Card className="mb-4 text-center">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h5 className="mb-0">Total Centers</h5>
                <h2 className="mt-3">{stats.totalCenters}</h2>
              </div>
              <div className="bg-success p-3 rounded-circle">
                <FaBuilding size={30} color="white" />
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col md={3}>
        <Card className="mb-4 text-center">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h5 className="mb-0">Pending Applications</h5>
                <h2 className="mt-3">{stats.pendingApplications}</h2>
              </div>
              <div className="bg-warning p-3 rounded-circle">
                <FaUsers size={30} color="white" />
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col md={3}>
        <Card className="mb-4 text-center">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h5 className="mb-0">Commission (Rs)</h5>
                <h2 className="mt-3">
                  {stats.totalCommission.toLocaleString()}
                </h2>
              </div>
              <div className="bg-info p-3 rounded-circle">
                <FaChartLine size={30} color="white" />
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>

      <Col md={6}>
        <Card className="mb-4">
          <Card.Header>
            <h5>Recent Applications</h5>
          </Card.Header>
          <Card.Body>
            {applications.length === 0 ? (
              <p>No recent applications</p>
            ) : (
              <Table responsive striped hover>
                <thead>
                  <tr>
                    <th>Business Name</th>
                    <th>Type</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.slice(0, 5).map((app) => (
                    <tr key={app._id}>
                      <td>{app.businessName}</td>
                      <td>
                        {app.applicationType === "vendor" ? "Vendor" : "Center"}
                      </td>
                      <td>
                        {app.status === "pending" && (
                          <Badge bg="warning">Pending</Badge>
                        )}
                        {app.status === "approved" && (
                          <Badge bg="success">Approved</Badge>
                        )}
                        {app.status === "rejected" && (
                          <Badge bg="danger">Rejected</Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card.Body>
        </Card>
      </Col>

      <Col md={6}>
        <Card className="mb-4">
          <Card.Header>
            <h5>Recent Messages</h5>
          </Card.Header>
          <Card.Body>
            {messages.length === 0 ? (
              <p>No recent messages</p>
            ) : (
              <div>
                {messages.slice(0, 5).map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-2 mb-2 ${!msg.read ? "bg-light" : ""}`}
                    style={{
                      borderLeft: !msg.read ? "3px solid #007bff" : "none",
                    }}
                  >
                    <div className="d-flex justify-content-between">
                      <strong>{msg.sender.name}</strong>
                      <small>{new Date(msg.date).toLocaleDateString()}</small>
                    </div>
                    <p className="mb-0">{msg.message}</p>
                  </div>
                ))}
              </div>
            )}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );

  const renderApplications = () => (
    <Card>
      <Card.Header>
        <h4>Pending Applications</h4>
      </Card.Header>
      <Card.Body>
        {applications.length === 0 ? (
          <p>No applications found.</p>
        ) : (
          <Table responsive striped bordered hover>
            <thead>
              <tr>
                <th>Business Name</th>
                <th>Type</th>
                <th>Email</th>
                <th>Submitted On</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications
                .filter((app) => app.status === "pending")
                .map((app) => (
                  <tr key={app._id}>
                    <td>{app.businessName}</td>
                    <td>
                      {app.applicationType === "vendor" ? "Vendor" : "Center"}
                    </td>
                    <td>{app.email}</td>
                    <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                    <td>
                      <Badge bg="warning">Pending</Badge>
                    </td>
                    <td>
                      <Button
                        variant="info"
                        size="sm"
                        onClick={() =>
                          handleViewDetails(app, app.applicationType)
                        }
                        className="me-2"
                      >
                        View Details
                      </Button>
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() =>
                          handleApprove(app._id, app.applicationType)
                        }
                        className="me-2"
                      >
                        Approve
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() =>
                          handleReject(app._id, app.applicationType)
                        }
                      >
                        Reject
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  );

  const renderVendors = () => (
    <Card>
      <Card.Header>
        <h4>Registered Vendors</h4>
      </Card.Header>
      <Card.Body>
        {vendors.length === 0 ? (
          <p>No vendors found.</p>
        ) : (
          <Table responsive striped bordered hover>
            <thead>
              <tr>
                <th>Business Name</th>
                <th>PAN</th>
                <th>Email</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((vendor) => (
                <tr key={vendor._id}>
                  <td>{vendor.businessName}</td>
                  <td>{vendor.pan}</td>
                  <td>{vendor.user.email}</td>
                  <td>
                    {vendor.status === "pending" && (
                      <Badge bg="warning">Pending</Badge>
                    )}
                    {vendor.status === "approved" && (
                      <Badge bg="success">Approved</Badge>
                    )}
                    {vendor.status === "rejected" && (
                      <Badge bg="danger">Rejected</Badge>
                    )}
                    {vendor.status === "suspended" && (
                      <Badge bg="secondary">Suspended</Badge>
                    )}
                  </td>
                  <td>
                    <Button
                      variant="info"
                      size="sm"
                      onClick={() => handleViewDetails(vendor, "vendor")}
                      className="me-2"
                    >
                      View Details
                    </Button>
                    {vendor.status === "approved" && (
                      <Button
                        variant="warning"
                        size="sm"
                        onClick={() => handleSuspend(vendor._id, "vendor")}
                        className="me-2"
                      >
                        Suspend
                      </Button>
                    )}
                    {vendor.status === "suspended" && (
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => handleApprove(vendor._id, "vendor")}
                        className="me-2"
                      >
                        Reactivate
                      </Button>
                    )}
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(vendor._id, "vendor")}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  );

  const renderCenters = () => (
    <Card>
      <Card.Header>
        <h4>Registered Centers</h4>
      </Card.Header>
      <Card.Body>
        {centers.length === 0 ? (
          <p>No centers found.</p>
        ) : (
          <Table responsive striped bordered hover>
            <thead>
              <tr>
                <th>Business Name</th>
                <th>Category</th>
                <th>PAN</th>
                <th>Email</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {centers.map((center) => (
                <tr key={center._id}>
                  <td>{center.businessName}</td>
                  <td>{center.category}</td>
                  <td>{center.pan}</td>
                  <td>{center.user.email}</td>
                  <td>
                    {center.status === "pending" && (
                      <Badge bg="warning">Pending</Badge>
                    )}
                    {center.status === "approved" && (
                      <Badge bg="success">Approved</Badge>
                    )}
                    {center.status === "rejected" && (
                      <Badge bg="danger">Rejected</Badge>
                    )}
                    {center.status === "suspended" && (
                      <Badge bg="secondary">Suspended</Badge>
                    )}
                  </td>
                  <td>
                    <Button
                      variant="info"
                      size="sm"
                      onClick={() => handleViewDetails(center, "center")}
                      className="me-2"
                    >
                      View Details
                    </Button>
                    {center.status === "approved" && (
                      <Button
                        variant="warning"
                        size="sm"
                        onClick={() => handleSuspend(center._id, "center")}
                        className="me-2"
                      >
                        Suspend
                      </Button>
                    )}
                    {center.status === "suspended" && (
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => handleApprove(center._id, "center")}
                        className="me-2"
                      >
                        Reactivate
                      </Button>
                    )}
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(center._id, "center")}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  );

  const renderMessages = () => (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Message Box</h4>
        <Button variant="primary" onClick={() => setShowMessageModal(true)}>
          New Message
        </Button>
      </div>

      <Card>
        <Card.Body>
          {messages.length === 0 ? (
            <p>No messages found.</p>
          ) : (
            <div>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-3 mb-3 border-bottom ${
                    !msg.read ? "bg-light" : ""
                  }`}
                  onClick={() => markMessageAsRead(msg.id)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="d-flex justify-content-between">
                    <h5>
                      {msg.sender.name}
                      <Badge
                        bg={
                          msg.sender.role === "vendor" ? "primary" : "success"
                        }
                        className="ms-2"
                      >
                        {msg.sender.role === "vendor" ? "Vendor" : "Center"}
                      </Badge>
                      {!msg.read && (
                        <Badge bg="danger" className="ms-2">
                          New
                        </Badge>
                      )}
                    </h5>
                    <small>{new Date(msg.date).toLocaleString()}</small>
                  </div>
                  <p>{msg.message}</p>
                  <div className="d-flex justify-content-end">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setMessageRecipient(msg.sender.name);
                        setShowMessageModal(true);
                      }}
                    >
                      Reply
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card.Body>
      </Card>

      {/* New Message Modal */}
      <Modal show={showMessageModal} onHide={() => setShowMessageModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>New Message</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Recipient</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter recipient name or select from list"
                value={messageRecipient}
                onChange={(e) => setMessageRecipient(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                placeholder="Type your message here"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowMessageModal(false)}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSendMessage}
            disabled={!messageRecipient || !messageText}
          >
            Send Message
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );

  return (
    <Container fluid>
      <Row>
        {/* Sidebar */}
        <Col
          md={3}
          lg={2}
          className="bg-dark text-white p-0"
          style={{ minHeight: "calc(100vh - 56px)" }}
        >
          <div className="p-3 text-center border-bottom">
            <h5>Admin Dashboard</h5>
          </div>
          <Nav className="flex-column">
            <Nav.Link
              className={`p-3 ${activeTab === "overview" ? "bg-primary" : ""}`}
              onClick={() => setActiveTab("overview")}
            >
              <FaChartLine className="me-2" /> Overview
            </Nav.Link>
            <Nav.Link
              className={`p-3 ${
                activeTab === "applications" ? "bg-primary" : ""
              }`}
              onClick={() => setActiveTab("applications")}
            >
              <FaUsers className="me-2" /> Applications
              {stats.pendingApplications > 0 && (
                <Badge bg="danger" className="ms-2">
                  {stats.pendingApplications}
                </Badge>
              )}
            </Nav.Link>
            <Nav.Link
              className={`p-3 ${activeTab === "vendors" ? "bg-primary" : ""}`}
              onClick={() => setActiveTab("vendors")}
            >
              <FaUserTie className="me-2" /> Vendors
            </Nav.Link>
            <Nav.Link
              className={`p-3 ${activeTab === "centers" ? "bg-primary" : ""}`}
              onClick={() => setActiveTab("centers")}
            >
              <FaBuilding className="me-2" /> Centers
            </Nav.Link>
            <Nav.Link
              className={`p-3 ${activeTab === "messages" ? "bg-primary" : ""}`}
              onClick={() => setActiveTab("messages")}
            >
              <FaEnvelope className="me-2" /> Messages
              {unreadMessages > 0 && (
                <Badge bg="danger" className="ms-2">
                  {unreadMessages}
                </Badge>
              )}
            </Nav.Link>
          </Nav>
        </Col>

        {/* Main Content */}
        <Col md={9} lg={10} className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="d-flex align-items-center">
              <img 
                src="/assets/images/vrs-logo.png" 
                alt="VRS Logo" 
                style={{ width: '50px', height: 'auto', marginRight: '10px' }} 
              />
              <h3 className="mb-0">Admin Dashboard</h3>
            </div>
            <div className="d-flex align-items-center">
              <Dropdown className="me-3">
                <Dropdown.Toggle variant="light" id="notification-dropdown">
                  <FaBell />
                  {unreadNotifications > 0 && (
                    <Badge
                      bg="danger"
                      className="position-absolute top-0 start-100 translate-middle badge rounded-pill"
                    >
                      {unreadNotifications}
                    </Badge>
                  )}
                </Dropdown.Toggle>
                <Dropdown.Menu align="end" style={{ minWidth: "300px" }}>
                  <Dropdown.Header>Notifications</Dropdown.Header>
                  {notifications.length === 0 ? (
                    <Dropdown.Item>No notifications</Dropdown.Item>
                  ) : (
                    notifications.map((notification) => (
                      <Dropdown.Item
                        key={notification.id}
                        className={!notification.read ? "bg-light" : ""}
                        onClick={() => markNotificationAsRead(notification.id)}
                      >
                        <div className="d-flex justify-content-between align-items-center">
                          <span>{notification.message}</span>
                          {!notification.read && (
                            <Badge bg="primary">New</Badge>
                          )}
                        </div>
                        <small className="text-muted">
                          {new Date(notification.date).toLocaleString()}
                        </small>
                      </Dropdown.Item>
                    ))
                  )}
                </Dropdown.Menu>
              </Dropdown>

              <Dropdown>
                <Dropdown.Toggle variant="light" id="profile-dropdown">
                  {user?.email || "Admin"}
                </Dropdown.Toggle>
                <Dropdown.Menu align="end">
                  <Dropdown.Item>Profile</Dropdown.Item>
                  <Dropdown.Item onClick={logout}>
                    <FaSignOutAlt className="me-2" /> Sign Out
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>

          {activeTab === "overview" && renderOverview()}
          {activeTab === "applications" && renderApplications()}
          {activeTab === "vendors" && renderVendors()}
          {activeTab === "centers" && renderCenters()}
          {activeTab === "messages" && renderMessages()}
        </Col>
      </Row>

      {/* Details Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        {(selectedVendor || selectedCenter) && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>
                {selectedVendor
                  ? selectedVendor.businessName
                  : selectedCenter.businessName}{" "}
                Details
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="row mb-4">
                <div className="col-md-6">
                  <h5>Business Information</h5>
                  <p>
                    <strong>Business Name:</strong>{" "}
                    {selectedVendor
                      ? selectedVendor.businessName
                      : selectedCenter.businessName}
                  </p>
                  <p>
                    <strong>PAN Number:</strong>{" "}
                    {selectedVendor ? selectedVendor.pan : selectedCenter.pan}
                  </p>
                  <p>
                    <strong>Email:</strong>{" "}
                    {selectedVendor
                      ? selectedVendor.email
                      : selectedCenter.email}
                  </p>
                  <p>
                    <strong>Phone:</strong>{" "}
                    {selectedVendor
                      ? selectedVendor.phone
                      : selectedCenter.phone}
                  </p>
                  {selectedCenter && (
                    <p>
                      <strong>Category:</strong> {selectedCenter.category}
                    </p>
                  )}
                </div>
                <div className="col-md-6">
                  <h5>Location</h5>
                  <p>
                    <strong>Province:</strong>{" "}
                    {selectedVendor
                      ? selectedVendor.province
                      : selectedCenter.province}
                  </p>
                  <p>
                    <strong>District:</strong>{" "}
                    {selectedVendor
                      ? selectedVendor.district
                      : selectedCenter.district}
                  </p>
                </div>
              </div>

              <div className="row mb-4">
                <div className="col-md-6">
                  <h5>Contact Persons</h5>
                  <p>
                    <strong>Primary Contact:</strong>
                    {selectedVendor
                      ? `${selectedVendor.contactPerson1.name} (${selectedVendor.contactPerson1.phone})`
                      : `${selectedCenter.contactPerson1.name} (${selectedCenter.contactPerson1.phone})`}
                  </p>
                  {((selectedVendor && selectedVendor.contactPerson2) ||
                    (selectedCenter && selectedCenter.contactPerson2)) && (
                    <p>
                      <strong>Secondary Contact:</strong>
                      {selectedVendor
                        ? `${selectedVendor.contactPerson2.name} (${selectedVendor.contactPerson2.phone})`
                        : `${selectedCenter.contactPerson2.name} (${selectedCenter.contactPerson2.phone})`}
                    </p>
                  )}
                </div>
                <div className="col-md-6">
                  <h5>Bank Details</h5>
                  <p>
                    <strong>Bank Name:</strong>
                    {selectedVendor
                      ? selectedVendor.bankDetails.bankName
                      : selectedCenter.bankDetails.bankName}
                  </p>
                  <p>
                    <strong>Account Number:</strong>
                    {selectedVendor
                      ? selectedVendor.bankDetails.accountNumber
                      : selectedCenter.bankDetails.accountNumber}
                  </p>
                  <p>
                    <strong>Branch:</strong>
                    {selectedVendor
                      ? selectedVendor.bankDetails.branch
                      : selectedCenter.bankDetails.branch}
                  </p>
                  <p>
                    <strong>Account Holder:</strong>
                    {selectedVendor
                      ? selectedVendor.bankDetails.accountHolderName
                      : selectedCenter.bankDetails.accountHolderName}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <h5>PAN Document</h5>
                <div className="border p-2">
                  <a
                    href={`/${
                      selectedVendor
                        ? selectedVendor.panDocument
                        : selectedCenter.panDocument
                    }`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Document
                  </a>
                </div>
              </div>

              <div className="mb-4">
                <h5>Application Status</h5>
                <Form.Select
                  value={
                    selectedVendor
                      ? selectedVendor.status
                      : selectedCenter.status
                  }
                  onChange={(e) => {
                    const id = selectedVendor
                      ? selectedVendor._id
                      : selectedCenter._id;
                    const type = selectedVendor ? "vendor" : "center";
                    if (e.target.value === "approved") {
                      handleApprove(id, type);
                    } else if (e.target.value === "rejected") {
                      handleReject(id, type);
                    } else if (e.target.value === "suspended") {
                      handleSuspend(id, type);
                    }
                  }}
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="suspended">Suspended</option>
                </Form.Select>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                Close
              </Button>
              {(selectedVendor && selectedVendor.status === "pending") ||
              (selectedCenter && selectedCenter.status === "pending") ? (
                <>
                  <Button
                    variant="success"
                    onClick={() =>
                      handleApprove(
                        selectedVendor
                          ? selectedVendor._id
                          : selectedCenter._id,
                        selectedVendor ? "vendor" : "center"
                      )
                    }
                  >
                    Approve
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() =>
                      handleReject(
                        selectedVendor
                          ? selectedVendor._id
                          : selectedCenter._id,
                        selectedVendor ? "vendor" : "center"
                      )
                    }
                  >
                    Reject
                  </Button>
                </>
              ) : null}
            </Modal.Footer>
          </>
        )}
      </Modal>
    </Container>
  );
};

export default AdminDashboard;
