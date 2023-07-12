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
    images = db.relationship('ProductImage', backref='product')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'price': self.price,
            'images': [image.to_dict() for image in self.images]
        }

class ProductImage(db.Model):
    __tablename__ = 'product_images'
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    image_url = db.Column(db.String(500), nullable=True) 

    def to_dict(self):
        return {
            'id': self.id,
            'product_id': self.product_id,
            'image_url': self.image_url,
        }
