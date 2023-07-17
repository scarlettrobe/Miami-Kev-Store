from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy import Enum

class Order(db.Model):
    __tablename__ = 'orders'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    order_number = db.Column(db.String(255), nullable=False, unique=True)
    order_date = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp())
    status = db.Column(Enum('pending_payment', 'failed', 'processing', 'completed', 'on_hold', 'cancelled', 'refunded', name='order_status'), nullable=False)
    billing_address = db.Column(db.String(500), nullable=False)
    shipping_address = db.Column(db.String(500), nullable=False)
    total_price = db.Column(db.Float, nullable=False)

    # New relationship
    order_items = db.relationship('OrderItem', backref='order')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'order_number': self.order_number,
            'order_date': self.order_date.isoformat(),
            'status': self.status,
            'billing_address': self.billing_address,
            'shipping_address': self.shipping_address,
            'total_price': self.total_price,
            'order_items': [order_item.to_dict() for order_item in self.order_items]
        }
class OrderItem(db.Model):
    __tablename__ = 'order_items'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('orders.id')), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('products.id')), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)

    # New relationship
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    product = db.relationship('Product', back_populates='order_items')

    def to_dict(self):
        return {
            'id': self.id,
            'order_id': self.order_id,
            'product_id': self.product_id,
            'quantity': self.quantity,
        }
