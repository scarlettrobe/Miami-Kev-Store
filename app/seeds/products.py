from app.models import db, Product, ProductImage, environment, SCHEMA
from sqlalchemy.sql import text

def seed_products():
    product1 = Product(
        name='Product 1',
        description='This is product 1',
        price=100,
    )
    
    image1_product1 = ProductImage(
        product_id=1,
        image_url='https://miamikevbucket.s3.amazonaws.com/stickersheet5.png'
    )

    product2 = Product(
        name='Product 2',
        description='This is product 2',
        price=200,
    )
    
    image1_product2 = ProductImage(
        product_id=2,
        image_url='https://miamikevbucket.s3.amazonaws.com/stickerbatch3.png'
    )
    image2_product2 = ProductImage(
        product_id=2,
        image_url='https://miamikevbucket.s3.amazonaws.com/fishkev700.png'
    )


    db.session.add(product1)
    db.session.add(image1_product1)
    db.session.add(product2)
    db.session.add(image1_product2)
    db.session.add(image2_product2)
    db.session.commit()

def undo_products():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.products RESTART IDENTITY CASCADE;")
        db.session.execute(f"TRUNCATE table {SCHEMA}.product_images RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM products"))
        db.session.execute(text("DELETE FROM product_images"))
    db.session.commit()
