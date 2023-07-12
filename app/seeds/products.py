from app.models import db, Product, environment, SCHEMA
from sqlalchemy.sql import text

def seed_products():
    product1 = Product(
        name='Product 1',
        description='This is product 1',
        price=100,
        image_url='https://miamikevbucket.s3.amazonaws.com/Untitled_Artwork+4.png'
    )

    product2 = Product(
        name='Product 2',
        description='This is product 2',
        price=200,
        image_url='https://miamikevbucket.s3.amazonaws.com/Untitled_Artwork+4.png'
    )

    # add more products as needed

    db.session.add(product1)
    db.session.add(product2)
    db.session.commit()

def undo_products():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.products RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM products"))
    db.session.commit()
