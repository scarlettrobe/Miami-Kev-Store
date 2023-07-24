const CustomerInfoModal = ({
  customerName,
  shippingAddress,
  billingAddress,
  orderedItems,
  quantity,
  total,
  orderDate,
  onClose
}) => {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{customerName}'s Information</h2>
        <p>Shipping Address: {shippingAddress}</p>
        <p>Billing Address: {billingAddress}</p>
        <p>Ordered Items:</p>
        {orderedItems.map((item, index) => (
          <p key={index}>
            {item} - Quantity: {quantity[index]}
          </p>
        ))}
        <p>Total: {total}</p>
        <p>Order Date: {orderDate}</p>
        <button id="ordermodalclose" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default CustomerInfoModal;
