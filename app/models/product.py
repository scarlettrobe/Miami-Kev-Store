from .db import db, environment, SCHEMA, add_prefix_for_prod
from flask_sqlalchemy import SQLAlchemy

class Product(db.Model):
    __tablename__ = 'products'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    price = db.Column(db.Float, nullable=False)
    is_available = db.Column(db.Boolean, nullable=False, default=True)

    order_items = db.relationship('OrderItem', back_populates='product')
    images = db.relationship('ProductImage', back_populates='product')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'price': self.price,
            'order_items': [order_item.to_dict() for order_item in self.order_items],
            'images': [image.to_dict() for image in self.images]  # Include this line
        }



class ProductImage(db.Model):
    __tablename__ = 'product_images'
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('products.id')), nullable=False)
    image_url = db.Column(db.String(500), nullable=True) 

    # New relationship
    product = db.relationship('Product', back_populates='images')

    def to_dict(self):
        return {
            'id': self.id,
            'product_id': self.product_id,
            'image_url': self.image_url,
        }
