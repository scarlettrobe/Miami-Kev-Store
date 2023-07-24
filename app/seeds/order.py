from app.models import db, Order, OrderItem
from datetime import datetime

def seed_orders():
    orders_data = [
        {
            'user_id': 1, 'order_number': 'ORDER001', 'status': 'completed', 
            'billing_address': '123 Main St, City, Country', 'shipping_address': '123 Main St, City, Country', 
            'total_price': 0.00, 'order_date': datetime.strptime('2023-07-01 14:30:00', "%Y-%m-%d %H:%M:%S"),
            'order_items': []  # Empty list to represent no items in the order
        },
        {
            'user_id': 2, 'order_number': 'ORDER002', 'status': 'processing', 
            'billing_address': '456 Broad St, City, Country', 'shipping_address': '789 High St, City, Country', 
            'total_price': 0.00, 'order_date': datetime.strptime('2023-07-02 15:30:00', "%Y-%m-%d %H:%M:%S"),
            'order_items': []  # Empty list to represent no items in the order
        },
        {
            'user_id': 3, 'order_number': 'ORDER003', 'status': 'completed', 
            'billing_address': '999 Pine St, City, Country', 'shipping_address': '111 Cedar St, City, Country', 
            'total_price': 0.00, 'order_date': datetime.strptime('2023-07-03 16:30:00', "%Y-%m-%d %H:%M:%S"),
            'order_items': []  # Empty list to represent no items in the order
        },
        {
            'user_id': 4, 'order_number': 'ORDER004', 'status': 'pending_payment', 
            'billing_address': '222 Oak St, City, Country', 'shipping_address': '333 Maple St, City, Country', 
            'total_price': 0.00, 'order_date': datetime.strptime('2023-07-04 17:30:00', "%Y-%m-%d %H:%M:%S"),
            'order_items': []  # Empty list to represent no items in the order
        },
        # Add more orders with no items and 0 dollars for price
    ]

    for order_data in orders_data:
        order_items_data = order_data.pop('order_items')
        order = Order(**order_data)
        for order_item_data in order_items_data:
            order.order_items.append(OrderItem(**order_item_data))
        db.session.add(order)

    db.session.commit()

def undo_orders():
    db.session.execute('TRUNCATE orders RESTART IDENTITY CASCADE;')
    db.session.execute('TRUNCATE order_items RESTART IDENTITY CASCADE;')
    db.session.commit()
