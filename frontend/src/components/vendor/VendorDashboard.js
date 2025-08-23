import React, { useState, useEffect, useContext } from "react";
import { 
  Container, Row, Col, Card, Alert, Table, Badge, Button, 
  Form, Modal, Tabs, Tab, Dropdown, InputGroup, FormControl,
  ListGroup, Spinner
} from "react-bootstrap";
import { 
  FaUser, FaShoppingCart, FaStore, FaTag, FaMoneyBillWave, 
  FaEnvelope, FaSearch, FaEdit, FaSignOutAlt, FaPlus, FaTrash,
  FaCheck, FaTimes
} from "react-icons/fa";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const VendorDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // State for vendor data
  const [vendorData, setVendorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for active tab
  const [activeTab, setActiveTab] = useState("overview");
  
  // State for profile editing
  const [editMode, setEditMode] = useState(false);
  const [phone, setPhone] = useState("");
  const [contactPerson1, setContactPerson1] = useState({ name: "", phone: "" });
  const [contactPerson2, setContactPerson2] = useState({ name: "", phone: "" });
  
  // State for products and centers
  const [products, setProducts] = useState([]);
  const [centers, setCenters] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchCategory, setSearchCategory] = useState("");
  const [selectedCenter, setSelectedCenter] = useState(null);
  
  // State for orders
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  // State for cart
  const [cart, setCart] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [cartDiscount, setCartDiscount] = useState(0);
  const [cartCommission, setCartCommission] = useState(0);
  const [cartFinalTotal, setCartFinalTotal] = useState(0);
  
  // State for messages
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [messageRecipient, setMessageRecipient] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  
  // State for modals
  const [showModal, setShowModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  
  // State for statistics
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalAmount: 0,
    totalDiscount: 0,
    totalCommission: 0,
    totalCenters: 0
  });
  
  // Fetch vendor data
  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        const res = await axios.get("/api/vendors/profile");
        setVendorData(res.data);
        setPhone(res.data.phone);
        setContactPerson1(res.data.contactPerson1);
        if (res.data.contactPerson2) {
          setContactPerson2(res.data.contactPerson2);
        }
      } catch (err) {
        setError("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchVendorData();
  }, []);
  
  // Fetch products, centers, orders, messages, and stats
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all centers with products
        const centersRes = await axios.get("/api/centers");
        setCenters(centersRes.data);
        
        // Fetch all products
        const productsRes = await axios.get("/api/products");
        setProducts(productsRes.data);
        setFilteredProducts(productsRes.data);
        
        // Fetch orders
        const ordersRes = await axios.get("/api/orders");
        setOrders(ordersRes.data);
        
        // Fetch messages
        const messagesRes = await axios.get("/api/messages");
        setMessages(messagesRes.data);
        
        // Fetch unread message count
        const unreadRes = await axios.get("/api/messages/unread");
        setUnreadCount(unreadRes.data.count);
        
        // Fetch order stats
        const statsRes = await axios.get("/api/orders/stats");
        setStats(statsRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    
    fetchData();
  }, []);
  
  // Handle profile update
  const handleProfileUpdate = async () => {
    try {
      const updatedData = {
        phone,
        contactPerson1,
        contactPerson2: contactPerson2.name ? contactPerson2 : null
      };
      
      await axios.put("/api/vendors/profile", updatedData);
      
      // Update local state
      setVendorData({
        ...vendorData,
        ...updatedData
      });
      
      setEditMode(false);
      setShowEditModal(false);
    } catch (err) {
      setError("Failed to update profile");
    }
  };
  
  // Handle search by category
  const handleCategorySearch = () => {
    if (!searchCategory.trim()) {
      setFilteredProducts(products);
      setSelectedCenter(null);
      return;
    }
    
    const filtered = products.filter(product => 
      product.category.toLowerCase().includes(searchCategory.toLowerCase())
    );
    
    setFilteredProducts(filtered);
  };
  
  // Handle adding product to cart
  const handleAddToCart = (product) => {
    const existingItem = cart.find(item => item.product._id === product._id);
    
    if (existingItem) {
      // Update quantity if already in cart
      const updatedCart = cart.map(item => 
        item.product._id === product._id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      );
      setCart(updatedCart);
    } else {
      // Add new item to cart
      setCart([...cart, { product, quantity: 1 }]);
    }
    
    // Update cart totals
    updateCartTotals([...cart, { product, quantity: 1 }]);
  };
  
  // Handle removing product from cart
  const handleRemoveFromCart = (productId) => {
    const updatedCart = cart.filter(item => item.product._id !== productId);
    setCart(updatedCart);
    updateCartTotals(updatedCart);
  };
  
  // Handle updating cart item quantity
  const handleUpdateQuantity = (productId, quantity) => {
    if (quantity < 1) return;
    
    const updatedCart = cart.map(item => 
      item.product._id === productId 
        ? { ...item, quantity } 
        : item
    );
    
    setCart(updatedCart);
    updateCartTotals(updatedCart);
  };
  
  // Update cart totals (subtotal, discount, commission, final total)
  const updateCartTotals = (cartItems) => {
    let total = 0;
    
    cartItems.forEach(item => {
      total += item.product.price * item.quantity;
    });
    
    // Calculate discount (assuming 5% or 10% based on district)
    // This is a placeholder - actual logic would check vendor and center districts
    const discountRate = 5; // Default 5%
    const discount = (total * discountRate) / 100;
    
    // Calculate commission (assuming 5%)
    const commissionRate = 5;
    const commission = ((total - discount) * commissionRate) / 100;
    
    // Calculate final total
    const finalTotal = total - discount;
    
    setCartTotal(total);
    setCartDiscount(discount);
    setCartCommission(commission);
    setCartFinalTotal(finalTotal);
  };
  
  // Handle checkout
  const handleCheckout = async () => {
    try {
      if (cart.length === 0) return;
      
      const orderData = {
        centerId: selectedCenter._id,
        items: cart.map(item => ({
          productId: item.product._id,
          quantity: item.quantity
        })),
        notes: "Order placed from vendor dashboard"
      };
      
      const res = await axios.post("/api/orders", orderData);
      
      // Clear cart after successful order
      setCart([]);
      setCartTotal(0);
      setCartDiscount(0);
      setCartCommission(0);
      setCartFinalTotal(0);
      
      // Add new order to orders list
      setOrders([res.data, ...orders]);
      
      // Show order details
      setSelectedOrder(res.data);
      setShowCartModal(false);
      setShowModal(true);
      
      // Update stats
      const statsRes = await axios.get("/api/orders/stats");
      setStats(statsRes.data);
    } catch (err) {
      setError("Failed to place order");
    }
  };
  
  // Handle sending message
  const handleSendMessage = async () => {
    try {
      if (!newMessage.trim() || !messageRecipient) return;
      
      const messageData = {
        receiverId: messageRecipient,
        content: newMessage,
        relatedProductId: null,
        relatedOrderId: null
      };
      
      const res = await axios.post("/api/messages", messageData);
      
      // Add new message to messages list
      setMessages([res.data, ...messages]);
      
      // Clear form
      setNewMessage("");
      setShowMessageModal(false);
    } catch (err) {
      setError("Failed to send message");
    }
  };
  
  // Handle product inquiry
  const handleProductInquiry = (product, centerId) => {
    setMessageRecipient(centerId);
    setNewMessage(`Inquiry about product: ${product.name}`);
    setShowMessageModal(true);
  };
  
  if (loading) {
    return <div className="text-center"><Spinner animation="border" /></div>;
  }
  
  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }
  
  if (!vendorData) {
    return (
      <Alert variant="info">
        You haven't submitted your application yet.{" "}
        <a href="/vendor/form">Click here</a> to submit.
      </Alert>
    );
  }
  
  // Render overview tab
  const renderOverview = () => (
    <Row>
      <Col md={3}>
        <Card className="mb-4 text-center">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h5 className="mb-0">Total Orders</h5>
                <h2 className="mt-3">{stats.totalOrders}</h2>
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
                <h5 className="mb-0">Total Centers</h5>
                <h2 className="mt-3">{stats.totalCenters}</h2>
              </div>
              <div className="bg-success p-3 rounded-circle">
                <FaStore size={30} color="white" />
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
                <h5 className="mb-0">Total Discount</h5>
                <h2 className="mt-3">Rs. {stats.totalDiscount.toLocaleString()}</h2>
              </div>
              <div className="bg-warning p-3 rounded-circle">
                <FaTag size={30} color="white" />
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
                <h5 className="mb-0">Commission Paid</h5>
                <h2 className="mt-3">Rs. {stats.totalCommission.toLocaleString()}</h2>
              </div>
              <div className="bg-danger p-3 rounded-circle">
                <FaMoneyBillWave size={30} color="white" />
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>
      
      <Col md={6}>
        <Card className="mb-4">
          <Card.Header className="d-flex justify-content-between align-items-center">
            <h4>Profile Information</h4>
            <Button variant="primary" size="sm" onClick={() => setShowEditModal(true)}>
              <FaEdit /> Edit Profile
            </Button>
          </Card.Header>
          <Card.Body>
            <div className="row">
              <div className="col-md-6">
                <p>
                  <strong>Business Name:</strong> {vendorData.businessName}
                </p>
                <p>
                  <strong>PAN Number:</strong> {vendorData.pan}
                </p>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <strong>Phone:</strong> {vendorData.phone}
                </p>
              </div>
              <div className="col-md-6">
                <p>
                  <strong>Province:</strong> {vendorData.province}
                </p>
                <p>
                  <strong>District:</strong> {vendorData.district}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  {vendorData.status === "pending" && (
                    <Badge bg="warning">Pending Review</Badge>
                  )}
                  {vendorData.status === "approved" && (
                    <Badge bg="success">Approved</Badge>
                  )}
                  {vendorData.status === "rejected" && (
                    <Badge bg="danger">Rejected</Badge>
                  )}
                </p>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>
      
      <Col md={6}>
        <Card className="mb-4">
          <Card.Header>
            <h4>Contact Persons</h4>
          </Card.Header>
          <Card.Body>
            <h5>Primary Contact</h5>
            <p>
              <strong>Name:</strong> {vendorData.contactPerson1.name}
            </p>
            <p>
              <strong>Phone:</strong> {vendorData.contactPerson1.phone}
            </p>

            {vendorData.contactPerson2 && (
              <>
                <h5 className="mt-3">Secondary Contact</h5>
                <p>
                  <strong>Name:</strong> {vendorData.contactPerson2.name}
                </p>
                <p>
                  <strong>Phone:</strong> {vendorData.contactPerson2.phone}
                </p>
              </>
            )}
          </Card.Body>
        </Card>
      </Col>
      
      <Col md={12}>
        <Card className="mb-4">
          <Card.Header>
            <h4>Bank Details</h4>
          </Card.Header>
          <Card.Body>
            <div className="row">
              <div className="col-md-6">
                <p>
                  <strong>Bank Name:</strong> {vendorData.bankDetails.bankName}
                </p>
                <p>
                  <strong>Account Number:</strong>{" "}
                  {vendorData.bankDetails.accountNumber}
                </p>
              </div>
              <div className="col-md-6">
                <p>
                  <strong>Branch:</strong> {vendorData.bankDetails.branch}
                </p>
                <p>
                  <strong>Account Holder:</strong>{" "}
                  {vendorData.bankDetails.accountHolderName}
                </p>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
  
  // Render products tab
  const renderProducts = () => (
    <>
      <Card className="mb-4">
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <h4>Search Products by Category</h4>
            <div className="d-flex">
              <InputGroup>
                <FormControl
                  placeholder="Enter category..."
                  value={searchCategory}
                  onChange={(e) => setSearchCategory(e.target.value)}
                />
                <Button variant="primary" onClick={handleCategorySearch}>
                  <FaSearch /> Search
                </Button>
              </InputGroup>
              {cart.length > 0 && (
                <Button 
                  variant="success" 
                  className="ms-2"
                  onClick={() => setShowCartModal(true)}
                >
                  <FaShoppingCart /> Cart ({cart.length})
                </Button>
              )}
            </div>
          </div>
        </Card.Header>
        <Card.Body>
          {filteredProducts.length === 0 ? (
            <p>No products found matching your search criteria.</p>
          ) : (
            <Row>
              {filteredProducts.map(product => (
                <Col md={4} key={product._id} className="mb-4">
                  <Card>
                    {product.image && (
                      <Card.Img 
                        variant="top" 
                        src={product.image} 
                        alt={product.name} 
                        style={{ height: "200px", objectFit: "cover" }}
                      />
                    )}
                    <Card.Body>
                      <Card.Title>{product.name}</Card.Title>
                      <Card.Subtitle className="mb-2 text-muted">
                        Category: {product.category}
                      </Card.Subtitle>
                      <Card.Text>
                        {product.description.substring(0, 100)}...
                      </Card.Text>
                      <div className="d-flex justify-content-between align-items-center">
                        <h5>Rs. {product.price.toLocaleString()}</h5>
                        {product.isAvailable ? (
                          <Badge bg="success">Available</Badge>
                        ) : (
                          <Badge bg="danger">Out of Stock</Badge>
                        )}
                      </div>
                      <div className="d-flex justify-content-between mt-3">
                        <Button 
                          variant="primary" 
                          size="sm"
                          onClick={() => handleProductInquiry(product, product.center)}
                        >
                          <FaEnvelope /> Inquire
                        </Button>
                        {product.isAvailable && (
                          <Button 
                            variant="success" 
                            size="sm"
                            onClick={() => handleAddToCart(product)}
                          >
                            <FaShoppingCart /> Add to Cart
                          </Button>
                        )}
                      </div>
                    </Card.Body>
                    <Card.Footer>
                      <small className="text-muted">
                        From: {centers.find(c => c._id === product.center)?.businessName || "Unknown Center"}
                      </small>
                    </Card.Footer>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Card.Body>
      </Card>
    </>
  );
  
  // Render orders tab
  const renderOrders = () => (
    <Card>
      <Card.Header>
        <h4>Your Orders</h4>
      </Card.Header>
      <Card.Body>
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <Table responsive striped bordered hover>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Center</th>
                <th>Items</th>
                <th>Total (Rs)</th>
                <th>Discount</th>
                <th>Final Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id}>
                  <td>{order._id.substring(0, 8)}</td>
                  <td>{centers.find(c => c._id === order.center)?.businessName || "Unknown"}</td>
                  <td>{order.items.length} items</td>
                  <td>{order.totalAmount.toLocaleString()}</td>
                  <td>{order.discountRate}% (Rs. {order.discountAmount.toLocaleString()})</td>
                  <td>{order.finalAmount.toLocaleString()}</td>
                  <td>
                    {order.status === "pending" && <Badge bg="warning">Pending</Badge>}
                    {order.status === "approved" && <Badge bg="success">Approved</Badge>}
                    {order.status === "rejected" && <Badge bg="danger">Rejected</Badge>}
                    {order.status === "paid" && <Badge bg="info">Paid</Badge>}
                    {order.status === "completed" && <Badge bg="primary">Completed</Badge>}
                  </td>
                  <td>
                    <Button
                      variant="info"
                      size="sm"
                      className="me-2"
                      onClick={() => {
                        setSelectedOrder(order);
                        setShowModal(true);
                      }}
                    >
                      View Details
                    </Button>
                    {order.status === "approved" && order.paymentStatus === "pending" && (
                      <Button
                        variant="success"
                        size="sm"
                        onClick={async () => {
                          try {
                            await axios.put(`/api/orders/${order._id}/payment`, {
                              paymentStatus: "completed"
                            });
                            
                            // Update order in state
                            const updatedOrders = orders.map(o => 
                              o._id === order._id 
                                ? { ...o, paymentStatus: "completed", status: "paid" } 
                                : o
                            );
                            setOrders(updatedOrders);
                          } catch (err) {
                            setError("Failed to update payment status");
                          }
                        }}
                      >
                        Pay Now
                      </Button>
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
  
  // Render messages tab
  const renderMessages = () => (
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h4>Messages</h4>
        <div>
          <Button 
            variant="primary" 
            onClick={() => {
              setMessageRecipient(null);
              setNewMessage("");
              setShowMessageModal(true);
            }}
          >
            <FaEnvelope /> New Message
          </Button>
        </div>
      </Card.Header>
      <Card.Body>
        {messages.length === 0 ? (
          <p>No messages found.</p>
        ) : (
          <div className="message-list">
            {messages.map(msg => (
              <div 
                key={msg._id} 
                className={`message-item p-3 mb-3 ${!msg.read && msg.receiver === user.id ? "bg-light" : ""}`}
                style={{ border: "1px solid #ddd", borderRadius: "5px" }}
              >
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h5>
                    {msg.sender.id === user.id ? (
                      <span>To: {msg.receiver.email} ({msg.receiver.role})</span>
                    ) : (
                      <span>From: {msg.sender.email} ({msg.sender.role})</span>
                    )}
                    {!msg.read && msg.receiver === user.id && (
                      <Badge bg="danger" className="ms-2">New</Badge>
                    )}
                  </h5>
                  <small>{new Date(msg.createdAt).toLocaleString()}</small>
                </div>
                <p>{msg.content}</p>
                {msg.relatedProduct && <p><small>Related to product: {msg.relatedProduct.name}</small></p>}
                {msg.relatedOrder && <p><small>Related to order: #{msg.relatedOrder._id.substring(0, 8)}</small></p>}
                <div className="d-flex justify-content-end">
                  {msg.sender.id !== user.id && (
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => {
                        setMessageRecipient(msg.sender.id);
                        setNewMessage(`Re: ${msg.content.substring(0, 30)}...\n\n`);
                        setShowMessageModal(true);
                        
                        // Mark as read if not already
                        if (!msg.read && msg.receiver === user.id) {
                          axios.put(`/api/messages/${msg._id}/read`)
                            .then(() => {
                              // Update message in state
                              const updatedMessages = messages.map(m => 
                                m._id === msg._id ? { ...m, read: true } : m
                              );
                              setMessages(updatedMessages);
                              setUnreadCount(Math.max(0, unreadCount - 1));
                            })
                            .catch(err => console.error("Error marking message as read:", err));
                        }
                      }}
                    >
                      Reply
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card.Body>
    </Card>
  );
  
  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <h2>Vendor Dashboard</h2>
            <div>
              {unreadCount > 0 && (
                <Badge 
                  bg="danger" 
                  className="me-3"
                  style={{ fontSize: "1rem" }}
                >
                  {unreadCount} new message{unreadCount !== 1 ? "s" : ""}
                </Badge>
              )}
              <Button 
                variant="outline-danger" 
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
              >
                <FaSignOutAlt /> Sign Out
              </Button>
            </div>
          </div>
        </Col>
      </Row>
      
      <Row>
        <Col md={3}>
          <ListGroup className="mb-4">
            <ListGroup.Item 
              action 
              active={activeTab === "overview"}
              onClick={() => setActiveTab("overview")}
            >
              <FaUser className="me-2" /> Overview
            </ListGroup.Item>
            <ListGroup.Item 
              action 
              active={activeTab === "products"}
              onClick={() => setActiveTab("products")}
            >
              <FaStore className="me-2" /> Browse Products
            </ListGroup.Item>
            <ListGroup.Item 
              action 
              active={activeTab === "orders"}
              onClick={() => setActiveTab("orders")}
            >
              <FaShoppingCart className="me-2" /> Orders
            </ListGroup.Item>
            <ListGroup.Item 
              action 
              active={activeTab === "messages"}
              onClick={() => setActiveTab("messages")}
            >
              <FaEnvelope className="me-2" /> Messages
              {unreadCount > 0 && (
                <Badge bg="danger" className="ms-2">{unreadCount}</Badge>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        
        <Col md={9}>
          {activeTab === "overview" && renderOverview()}
          {activeTab === "products" && renderProducts()}
          {activeTab === "orders" && renderOrders()}
          {activeTab === "messages" && renderMessages()}
        </Col>
      </Row>
      
      {/* Edit Profile Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control 
                type="text" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)}
              />
            </Form.Group>
            
            <h5>Primary Contact Person</h5>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control 
                type="text" 
                value={contactPerson1.name} 
                onChange={(e) => setContactPerson1({...contactPerson1, name: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control 
                type="text" 
                value={contactPerson1.phone} 
                onChange={(e) => setContactPerson1({...contactPerson1, phone: e.target.value})}
              />
            </Form.Group>
            
            <h5>Secondary Contact Person (Optional)</h5>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control 
                type="text" 
                value={contactPerson2?.name || ""} 
                onChange={(e) => setContactPerson2({...contactPerson2, name: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control 
                type="text" 
                value={contactPerson2?.phone || ""} 
                onChange={(e) => setContactPerson2({...contactPerson2, phone: e.target.value})}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleProfileUpdate}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* Order Details Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        {selectedOrder && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>Order Details #{selectedOrder._id.substring(0, 8)}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="row mb-4">
                <div className="col-md-6">
                  <h5>Order Information</h5>
                  <p>
                    <strong>Order Date:</strong>{" "}
                    {new Date(selectedOrder.createdAt).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    {selectedOrder.status === "pending" && <Badge bg="warning">Pending</Badge>}
                    {selectedOrder.status === "approved" && <Badge bg="success">Approved</Badge>}
                    {selectedOrder.status === "rejected" && <Badge bg="danger">Rejected</Badge>}
                    {selectedOrder.status === "paid" && <Badge bg="info">Paid</Badge>}
                    {selectedOrder.status === "completed" && <Badge bg="primary">Completed</Badge>}
                  </p>
                  <p>
                    <strong>Payment Status:</strong>{" "}
                    {selectedOrder.paymentStatus === "pending" && <Badge bg="warning">Pending</Badge>}
                    {selectedOrder.paymentStatus === "completed" && <Badge bg="success">Completed</Badge>}
                  </p>
                </div>
                <div className="col-md-6">
                  <h5>Center Information</h5>
                  <p>
                    <strong>Center:</strong>{" "}
                    {centers.find(c => c._id === selectedOrder.center)?.businessName || "Unknown"}
                  </p>
                  <p>
                    <strong>Discount Rate:</strong> {selectedOrder.discountRate}%
                  </p>
                  <p>
                    <strong>Commission Rate:</strong> {selectedOrder.commissionRate}%
                  </p>
                </div>
              </div>
              
              <h5>Order Items</h5>
              <Table responsive striped bordered hover>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Price (Rs)</th>
                    <th>Total (Rs)</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items.map((item, index) => (
                    <tr key={index}>
                      <td>{item.product.name}</td>
                      <td>{item.quantity}</td>
                      <td>{item.price.toLocaleString()}</td>
                      <td>{(item.price * item.quantity).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="3" className="text-end"><strong>Subtotal:</strong></td>
                    <td>{selectedOrder.totalAmount.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="text-end"><strong>Discount ({selectedOrder.discountRate}%):</strong></td>
                    <td>{selectedOrder.discountAmount.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="text-end"><strong>Final Amount:</strong></td>
                    <td>{selectedOrder.finalAmount.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="text-end"><strong>Commission ({selectedOrder.commissionRate}%):</strong></td>
                    <td>{selectedOrder.commissionAmount.toLocaleString()}</td>
                  </tr>
                </tfoot>
              </Table>
              
              {selectedOrder.notes && (
                <div className="mt-3">
                  <h5>Notes</h5>
                  <p>{selectedOrder.notes}</p>
                </div>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Close
              </Button>
              {selectedOrder.status === "approved" && selectedOrder.paymentStatus === "pending" && (
                <Button
                  variant="success"
                  onClick={async () => {
                    try {
                      await axios.put(`/api/orders/${selectedOrder._id}/payment`, {
                        paymentStatus: "completed"
                      });
                      
                      // Update order in state
                      const updatedOrders = orders.map(o => 
                        o._id === selectedOrder._id 
                          ? { ...o, paymentStatus: "completed", status: "paid" } 
                          : o
                      );
                      setOrders(updatedOrders);
                      
                      // Update selected order
                      setSelectedOrder({
                        ...selectedOrder,
                        paymentStatus: "completed",
                        status: "paid"
                      });
                    } catch (err) {
                      setError("Failed to update payment status");
                    }
                  }}
                >
                  Pay Now
                </Button>
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
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Recipient</Form.Label>
              <Form.Select 
                value={messageRecipient || ""} 
                onChange={(e) => setMessageRecipient(e.target.value)}
                required
              >
                <option value="">Select recipient...</option>
                <option value="admin">Admin</option>
                {centers.map(center => (
                  <option key={center._id} value={center.user}>
                    {center.businessName} (Center)
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Message</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={5} 
                value={newMessage} 
                onChange={(e) => setNewMessage(e.target.value)}
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowMessageModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || !messageRecipient}
          >
            Send Message
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* Cart Modal */}
      <Modal show={showCartModal} onHide={() => setShowCartModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Shopping Cart</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <>
              <Table responsive striped bordered hover>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price (Rs)</th>
                    <th>Quantity</th>
                    <th>Total (Rs)</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map(item => (
                    <tr key={item.product._id}>
                      <td>{item.product.name}</td>
                      <td>{item.product.price.toLocaleString()}</td>
                      <td>
                        <InputGroup size="sm">
                          <Button 
                            variant="outline-secondary"
                            onClick={() => handleUpdateQuantity(item.product._id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            -
                          </Button>
                          <FormControl 
                            value={item.quantity} 
                            onChange={(e) => handleUpdateQuantity(item.product._id, parseInt(e.target.value) || 1)}
                            style={{ textAlign: "center" }}
                          />
                          <Button 
                            variant="outline-secondary"
                            onClick={() => handleUpdateQuantity(item.product._id, item.quantity + 1)}
                          >
                            +
                          </Button>
                        </InputGroup>
                      </td>
                      <td>{(item.product.price * item.quantity).toLocaleString()}</td>
                      <td>
                        <Button 
                          variant="danger" 
                          size="sm"
                          onClick={() => handleRemoveFromCart(item.product._id)}
                        >
                          <FaTrash />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="3" className="text-end"><strong>Subtotal:</strong></td>
                    <td colSpan="2">Rs. {cartTotal.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="text-end"><strong>Discount (5%):</strong></td>
                    <td colSpan="2">Rs. {cartDiscount.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="text-end"><strong>Final Amount:</strong></td>
                    <td colSpan="2">Rs. {cartFinalTotal.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="text-end"><strong>Commission (5%):</strong></td>
                    <td colSpan="2">Rs. {cartCommission.toLocaleString()}</td>
                  </tr>
                </tfoot>
              </Table>
              
              <Form.Group className="mb-3">
                <Form.Label>Select Center</Form.Label>
                <Form.Select 
                  value={selectedCenter?._id || ""} 
                  onChange={(e) => {
                    const center = centers.find(c => c._id === e.target.value);
                    setSelectedCenter(center);
                  }}
                  required
                >
                  <option value="">Select center...</option>
                  {centers.map(center => (
                    <option key={center._id} value={center._id}>
                      {center.businessName}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCartModal(false)}>
            Close
          </Button>
          <Button 
            variant="success" 
            onClick={handleCheckout}
            disabled={cart.length === 0 || !selectedCenter}
          >
            Checkout
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default VendorDashboard;
