import React, { useState, useEffect, useContext } from "react";
import {
  Card,
  Alert,
  Row,
  Col,
  Table,
  Badge,
  Button,
  Modal,
  Form,
  Nav,
  Dropdown,
} from "react-bootstrap";
import {
  FaBox,
  FaShoppingCart,
  FaEnvelope,
  FaUserTie,
  FaSignOutAlt,
  FaChartLine,
  FaEdit,
  FaPlus,
} from "react-icons/fa";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const CenterDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("overview");
  const [centerData, setCenterData] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [messages, setMessages] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [messageRecipient, setMessageRecipient] = useState("");
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [editedPhone, setEditedPhone] = useState("");
  const [editedContactPerson1, setEditedContactPerson1] = useState({
    name: "",
    phone: "",
  });
  const [editedContactPerson2, setEditedContactPerson2] = useState({
    name: "",
    phone: "",
  });
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: 0,
    quantity: 0,
    category: "",
  });
  const [stats, setStats] = useState({
    totalSales: 0,
    totalInventory: 0,
    totalVendors: 0,
    totalIncome: 0,
    commissionPaid: 0,
  });

  useEffect(() => {
    if (activeTab === "overview") {
      fetchCenterData();
      fetchStats();
    } else if (activeTab === "inventory") {
      fetchProducts();
    } else if (activeTab === "orders") {
      fetchOrders();
    } else if (activeTab === "messages") {
      fetchMessages();
    } else if (activeTab === "vendors") {
      fetchVendors();
    }
  }, [activeTab]);

  const fetchCenterData = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/centers/profile");
      setCenterData(res.data);
      setEditedPhone(res.data.phone);
      setEditedContactPerson1(res.data.contactPerson1);
      if (res.data.contactPerson2) {
        setEditedContactPerson2(res.data.contactPerson2);
      }
      setLoading(false);
    } catch (err) {
      setError("Failed to load profile data");
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // In a real application, you would fetch this data from your API
      // For now, we'll simulate it with mock data
      const res = await axios.get("/api/centers/stats");
      setStats({
        totalSales: res.data.totalSales || 25,
        totalInventory: res.data.totalInventory || 150,
        totalVendors: res.data.totalVendors || 8,
        totalIncome: res.data.totalIncome || 125000,
        commissionPaid: res.data.commissionPaid || 6250,
      });
    } catch (err) {
      console.error("Failed to load statistics", err);
      // Use mock data as fallback
      setStats({
        totalSales: 25,
        totalInventory: 150,
        totalVendors: 8,
        totalIncome: 125000,
        commissionPaid: 6250,
      });
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/centers/products");
      setProducts(res.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load products");
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/centers/orders");
      setOrders(res.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load orders");
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await axios.get("/api/messages");
      setMessages(res.data);
      setUnreadMessages(res.data.filter((msg) => !msg.read).length);
    } catch (err) {
      console.error("Failed to load messages", err);
      // Use mock data as fallback
      const mockMessages = [
        {
          id: "1",
          sender: { id: "v1", name: "Vendor ABC", role: "vendor" },
          content: "Do you have Product X in stock?",
          date: new Date(),
          read: false,
        },
        {
          id: "2",
          sender: { id: "a1", name: "Admin", role: "admin" },
          content: "Your monthly commission payment is due.",
          date: new Date(Date.now() - 86400000),
          read: true,
        },
      ];
      setMessages(mockMessages);
      setUnreadMessages(mockMessages.filter((msg) => !msg.read).length);
    }
  };

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/centers/vendors");
      setVendors(res.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load vendors");
      setLoading(false);
    }
  };

  const handleOrderAction = async (orderId, action) => {
    try {
      await axios.put(`/api/centers/orders/${orderId}`, { status: action });
      fetchOrders();
      if (selectedOrder && selectedOrder._id === orderId) {
        setShowModal(false);
        setSelectedOrder(null);
      }
    } catch (err) {
      setError(`Failed to ${action} order`);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/messages", {
        receiver: messageRecipient,
        content: messageText,
      });
      setMessageText("");
      setShowMessageModal(false);
      fetchMessages();
    } catch (err) {
      setError("Failed to send message");
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await axios.put("/api/centers/profile", {
        phone: editedPhone,
        contactPerson1: editedContactPerson1,
        contactPerson2: editedContactPerson2,
      });
      setShowEditProfileModal(false);
      fetchCenterData();
    } catch (err) {
      setError("Failed to update profile");
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/centers/products", newProduct);
      setShowProductModal(false);
      setNewProduct({
        name: "",
        description: "",
        price: 0,
        quantity: 0,
        category: "",
      });
      fetchProducts();
    } catch (err) {
      setError("Failed to add product");
    }
  };

  const markMessageAsRead = async (messageId) => {
    try {
      await axios.put(`/api/messages/${messageId}/read`);
      fetchMessages();
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

  if (!centerData && activeTab === "overview") {
    return (
      <Alert variant="info">
        You haven't submitted your application yet.{" "}
        <a href="/center/form">Click here</a> to submit.
      </Alert>
    );
  }

  const renderOverview = () => (
    <>
      <Row>
        <Col md={3}>
          <Card className="mb-4 text-center">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="mb-0">Total Sales</h5>
                  <h2 className="mt-3">{stats.totalSales}</h2>
                </div>
                <div className="bg-primary p-3 rounded-circle">
                  <FaShoppingCart size={30} color="white" />
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
                  <h5 className="mb-0">Total Inventory</h5>
                  <h2 className="mt-3">{stats.totalInventory}</h2>
                </div>
                <div className="bg-success p-3 rounded-circle">
                  <FaBox size={30} color="white" />
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
                  <h5 className="mb-0">Total Vendors</h5>
                  <h2 className="mt-3">{stats.totalVendors}</h2>
                </div>
                <div className="bg-warning p-3 rounded-circle">
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
                  <h5 className="mb-0">Total Income (Rs)</h5>
                  <h2 className="mt-3">{stats.totalIncome.toLocaleString()}</h2>
                </div>
                <div className="bg-info p-3 rounded-circle">
                  <FaChartLine size={30} color="white" />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header>
              <h5>Center Information</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between mb-3">
                <div>
                  <p>
                    <strong>Center Name:</strong> {centerData.businessName}
                  </p>
                  <p>
                    <strong>PAN Number:</strong> {centerData.pan}
                  </p>
                  <p>
                    <strong>Email:</strong> {user.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {centerData.phone}
                  </p>
                  <p>
                    <strong>Category:</strong> {centerData.category}
                  </p>
                </div>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => setShowEditProfileModal(true)}
                >
                  <FaEdit /> Edit Profile
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="mb-4">
            <Card.Header>
              <h5>Commission Information</h5>
            </Card.Header>
            <Card.Body>
              <p>
                <strong>Commission Paid to Admin:</strong> Rs{" "}
                {stats.commissionPaid.toLocaleString()}
              </p>
              <p>
                <strong>Commission Rate:</strong> 5%
              </p>
              <p>
                <strong>Last Payment Date:</strong>{" "}
                {new Date().toLocaleDateString()}
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={12}>
          <Card className="mb-4">
            <Card.Header>
              <h5>Recent Orders</h5>
            </Card.Header>
            <Card.Body>
              {orders.length === 0 ? (
                <p>No recent orders</p>
              ) : (
                <Table responsive striped hover>
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Vendor</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map((order) => (
                      <tr key={order._id}>
                        <td>#{order._id.substring(0, 8)}</td>
                        <td>{order.vendorName}</td>
                        <td>Rs {order.finalAmount.toLocaleString()}</td>
                        <td>
                          {order.status === "pending" && (
                            <Badge bg="warning">Pending</Badge>
                          )}
                          {order.status === "approved" && (
                            <Badge bg="success">Approved</Badge>
                          )}
                          {order.status === "rejected" && (
                            <Badge bg="danger">Rejected</Badge>
                          )}
                          {order.status === "paid" && (
                            <Badge bg="info">Paid</Badge>
                          )}
                          {order.status === "completed" && (
                            <Badge bg="primary">Completed</Badge>
                          )}
                        </td>
                        <td>
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );

  const renderInventory = () => (
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h4>Product Inventory</h4>
        <Button variant="success" onClick={() => setShowProductModal(true)}>
          <FaPlus /> Add Product
        </Button>
      </Card.Header>
      <Card.Body>
        {products.length === 0 ? (
          <p>No products found. Add your first product!</p>
        ) : (
          <Table responsive striped bordered hover>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Category</th>
                <th>Price (Rs)</th>
                <th>Quantity</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>{product.price.toLocaleString()}</td>
                  <td>{product.quantity}</td>
                  <td>
                    {product.isAvailable ? (
                      <Badge bg="success">Available</Badge>
                    ) : (
                      <Badge bg="danger">Out of Stock</Badge>
                    )}
                  </td>
                  <td>
                    <Button
                      variant="primary"
                      size="sm"
                      className="me-2"
                      onClick={() => {
                        // Handle edit product
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant={product.isAvailable ? "warning" : "success"}
                      size="sm"
                      onClick={() => {
                        // Handle toggle availability
                      }}
                    >
                      {product.isAvailable
                        ? "Mark Unavailable"
                        : "Mark Available"}
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

  const renderOrders = () => (
    <Card>
      <Card.Header>
        <h4>Vendor Orders</h4>
      </Card.Header>
      <Card.Body>
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <Table responsive striped bordered hover>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Vendor</th>
                <th>District</th>
                <th>Items</th>
                <th>Amount (Rs)</th>
                <th>Discount</th>
                <th>Final Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>#{order._id.substring(0, 8)}</td>
                  <td>{order.vendorName}</td>
                  <td>{order.vendorDistrict}</td>
                  <td>{order.items.length}</td>
                  <td>{order.totalAmount.toLocaleString()}</td>
                  <td>
                    {order.discountRate}% (Rs{" "}
                    {order.discountAmount.toLocaleString()})
                  </td>
                  <td>{order.finalAmount.toLocaleString()}</td>
                  <td>
                    {order.status === "pending" && (
                      <Badge bg="warning">Pending</Badge>
                    )}
                    {order.status === "approved" && (
                      <Badge bg="success">Approved</Badge>
                    )}
                    {order.status === "rejected" && (
                      <Badge bg="danger">Rejected</Badge>
                    )}
                    {order.status === "paid" && <Badge bg="info">Paid</Badge>}
                    {order.status === "completed" && (
                      <Badge bg="primary">Completed</Badge>
                    )}
                  </td>
                  <td>
                    <Button
                      variant="info"
                      size="sm"
                      onClick={() => {
                        setSelectedOrder(order);
                        setShowModal(true);
                      }}
                      className="me-2"
                    >
                      View Details
                    </Button>
                    {order.status === "pending" && (
                      <>
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() =>
                            handleOrderAction(order._id, "approved")
                          }
                          className="me-2"
                        >
                          Approve
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() =>
                            handleOrderAction(order._id, "rejected")
                          }
                        >
                          Reject
                        </Button>
                      </>
                    )}
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
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h4>Messages</h4>
        <Button
          variant="primary"
          onClick={() => {
            setMessageRecipient("");
            setShowMessageModal(true);
          }}
        >
          New Message
        </Button>
      </Card.Header>
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
                        msg.sender.role === "vendor"
                          ? "primary"
                          : msg.sender.role === "admin"
                          ? "danger"
                          : "success"
                      }
                      className="ms-2"
                    >
                      {msg.sender.role === "vendor"
                        ? "Vendor"
                        : msg.sender.role === "admin"
                        ? "Admin"
                        : "Center"}
                    </Badge>
                    {!msg.read && (
                      <Badge bg="danger" className="ms-2">
                        New
                      </Badge>
                    )}
                  </h5>
                  <small>{new Date(msg.date).toLocaleString()}</small>
                </div>
                <p>{msg.content}</p>
                <div className="d-flex justify-content-end">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setMessageRecipient(msg.sender.id);
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
  );

  const renderVendors = () => (
    <Card>
      <Card.Header>
        <h4>Connected Vendors</h4>
      </Card.Header>
      <Card.Body>
        {vendors.length === 0 ? (
          <p>No vendors found.</p>
        ) : (
          <Table responsive striped bordered hover>
            <thead>
              <tr>
                <th>Business Name</th>
                <th>District</th>
                <th>Total Orders</th>
                <th>Total Amount (Rs)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((vendor) => (
                <tr key={vendor._id}>
                  <td>{vendor.businessName}</td>
                  <td>{vendor.district}</td>
                  <td>{vendor.orderCount}</td>
                  <td>{vendor.totalAmount.toLocaleString()}</td>
                  <td>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        setMessageRecipient(vendor.userId);
                        setShowMessageModal(true);
                      }}
                    >
                      Message
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

  return (
    <div className="container-fluid">
      <Row className="flex-nowrap">
        {/* Sidebar */}
        <Col
          md={3}
          lg={2}
          className="bg-dark text-white p-0"
          style={{ minHeight: "100vh" }}
        >
          <div className="d-flex flex-column p-3">
            <h3 className="text-center mb-4">Center Dashboard</h3>
            <Nav className="flex-column">
              <Nav.Link
                className={`p-3 ${
                  activeTab === "overview" ? "bg-primary" : ""
                }`}
                onClick={() => setActiveTab("overview")}
              >
                <FaChartLine className="me-2" /> Overview
              </Nav.Link>
              <Nav.Link
                className={`p-3 ${
                  activeTab === "inventory" ? "bg-primary" : ""
                }`}
                onClick={() => setActiveTab("inventory")}
              >
                <FaBox className="me-2" /> Inventory
              </Nav.Link>
              <Nav.Link
                className={`p-3 ${activeTab === "orders" ? "bg-primary" : ""}`}
                onClick={() => setActiveTab("orders")}
              >
                <FaShoppingCart className="me-2" /> Orders
              </Nav.Link>
              <Nav.Link
                className={`p-3 ${activeTab === "vendors" ? "bg-primary" : ""}`}
                onClick={() => setActiveTab("vendors")}
              >
                <FaUserTie className="me-2" /> Vendors
              </Nav.Link>
              <Nav.Link
                className={`p-3 ${
                  activeTab === "messages" ? "bg-primary" : ""
                }`}
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
          </div>
        </Col>

        {/* Main Content */}
        <Col md={9} lg={10} className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
            <Dropdown>
              <Dropdown.Toggle variant="light" id="profile-dropdown">
                {user?.email || "Center"}
              </Dropdown.Toggle>
              <Dropdown.Menu align="end">
                <Dropdown.Item onClick={() => setShowEditProfileModal(true)}>
                  Edit Profile
                </Dropdown.Item>
                <Dropdown.Item onClick={logout}>
                  <FaSignOutAlt className="me-2" /> Sign Out
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>

          {activeTab === "overview" && renderOverview()}
          {activeTab === "inventory" && renderInventory()}
          {activeTab === "orders" && renderOrders()}
          {activeTab === "vendors" && renderVendors()}
          {activeTab === "messages" && renderMessages()}
        </Col>
      </Row>

      {/* Order Details Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        {selectedOrder && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>
                Order Details #{selectedOrder._id.substring(0, 8)}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="row mb-4">
                <div className="col-md-6">
                  <h5>Vendor Information</h5>
                  <p>
                    <strong>Business Name:</strong> {selectedOrder.vendorName}
                  </p>
                  <p>
                    <strong>District:</strong> {selectedOrder.vendorDistrict}
                  </p>
                  <p>
                    <strong>Discount Rate:</strong> {selectedOrder.discountRate}
                    %
                  </p>
                </div>
                <div className="col-md-6">
                  <h5>Order Information</h5>
                  <p>
                    <strong>Order Date:</strong>{" "}
                    {new Date(selectedOrder.createdAt).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <Badge
                      bg={
                        selectedOrder.status === "pending"
                          ? "warning"
                          : selectedOrder.status === "approved"
                          ? "success"
                          : selectedOrder.status === "rejected"
                          ? "danger"
                          : selectedOrder.status === "paid"
                          ? "info"
                          : "primary"
                      }
                    >
                      {selectedOrder.status.charAt(0).toUpperCase() +
                        selectedOrder.status.slice(1)}
                    </Badge>
                  </p>
                  <p>
                    <strong>Payment Status:</strong>{" "}
                    <Badge
                      bg={
                        selectedOrder.paymentStatus === "pending"
                          ? "warning"
                          : "success"
                      }
                    >
                      {selectedOrder.paymentStatus.charAt(0).toUpperCase() +
                        selectedOrder.paymentStatus.slice(1)}
                    </Badge>
                  </p>
                </div>
              </div>

              <h5>Order Items</h5>
              <Table responsive striped bordered>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Price (Rs)</th>
                    <th>Discount</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items.map((item, index) => (
                    <tr key={index}>
                      <td>{item.productName}</td>
                      <td>{item.quantity}</td>
                      <td>{item.price.toLocaleString()}</td>
                      <td>{item.discount.toLocaleString()}</td>
                      <td>
                        {(
                          (item.price - item.discount) *
                          item.quantity
                        ).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="4" className="text-end">
                      <strong>Subtotal:</strong>
                    </td>
                    <td>{selectedOrder.totalAmount.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td colSpan="4" className="text-end">
                      <strong>Discount:</strong>
                    </td>
                    <td>{selectedOrder.discountAmount.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td colSpan="4" className="text-end">
                      <strong>Final Amount:</strong>
                    </td>
                    <td>{selectedOrder.finalAmount.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td colSpan="4" className="text-end">
                      <strong>Commission to Admin (5%):</strong>
                    </td>
                    <td>{selectedOrder.commissionAmount.toLocaleString()}</td>
                  </tr>
                </tfoot>
              </Table>

              {selectedOrder.notes && (
                <div className="mb-3">
                  <h5>Notes</h5>
                  <p>{selectedOrder.notes}</p>
                </div>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Close
              </Button>
              {selectedOrder.status === "pending" && (
                <>
                  <Button
                    variant="success"
                    onClick={() =>
                      handleOrderAction(selectedOrder._id, "approved")
                    }
                  >
                    Approve Order
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() =>
                      handleOrderAction(selectedOrder._id, "rejected")
                    }
                  >
                    Reject Order
                  </Button>
                </>
              )}
            </Modal.Footer>
          </>
        )}
      </Modal>

      {/* Message Modal */}
      <Modal show={showMessageModal} onHide={() => setShowMessageModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Send Message</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSendMessage}>
            <Form.Group className="mb-3">
              <Form.Label>Recipient</Form.Label>
              <Form.Select
                value={messageRecipient}
                onChange={(e) => setMessageRecipient(e.target.value)}
                required
              >
                <option value="">Select Recipient</option>
                <option value="admin">Admin</option>
                {vendors.map((vendor) => (
                  <option key={vendor.userId} value={vendor.userId}>
                    {vendor.businessName} (Vendor)
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Send Message
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Edit Profile Modal */}
      <Modal
        show={showEditProfileModal}
        onHide={() => setShowEditProfileModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdateProfile}>
            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                value={editedPhone}
                onChange={(e) => setEditedPhone(e.target.value)}
                required
              />
            </Form.Group>

            <h5>Primary Contact Person</h5>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={editedContactPerson1.name}
                onChange={(e) =>
                  setEditedContactPerson1({
                    ...editedContactPerson1,
                    name: e.target.value,
                  })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                value={editedContactPerson1.phone}
                onChange={(e) =>
                  setEditedContactPerson1({
                    ...editedContactPerson1,
                    phone: e.target.value,
                  })
                }
                required
              />
            </Form.Group>

            <h5>Secondary Contact Person (Optional)</h5>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={editedContactPerson2.name || ""}
                onChange={(e) =>
                  setEditedContactPerson2({
                    ...editedContactPerson2,
                    name: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                value={editedContactPerson2.phone || ""}
                onChange={(e) =>
                  setEditedContactPerson2({
                    ...editedContactPerson2,
                    phone: e.target.value,
                  })
                }
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Update Profile
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Add Product Modal */}
      <Modal show={showProductModal} onHide={() => setShowProductModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddProduct}>
            <Form.Group className="mb-3">
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                type="text"
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, name: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                value={newProduct.category}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, category: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newProduct.description}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, description: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Price (Rs)</Form.Label>
              <Form.Control
                type="number"
                min="0"
                value={newProduct.price}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    price: parseFloat(e.target.value),
                  })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                min="0"
                value={newProduct.quantity}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    quantity: parseInt(e.target.value),
                  })
                }
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Add Product
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default CenterDashboard;
