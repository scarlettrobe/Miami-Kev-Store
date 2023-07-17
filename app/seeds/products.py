from app.models import db, Product, ProductImage

def seed_products():
    products_data = [
        {
            'name': 'Product 1',
            'description': 'This is product 1',
            'price': 100,
            'images': [
                'https://miamikevbucket.s3.amazonaws.com/stickersheet5.png'
            ]
        },
        {
            'name': 'Product 2',
            'description': 'This is product 2',
            'price': 200,
            'images': [
                'https://miamikevbucket.s3.amazonaws.com/stickerbatch3.png',
                'https://miamikevbucket.s3.amazonaws.com/fishkev700.png'
            ]
        },
        {
            'name': 'Product 3',
            'description': 'This is product 3',
            'price': 300,
            'images': [
                'https://miamikevbucket.s3.amazonaws.com/vintage.png',
            ]
        },
        {
            'name': 'Product 4',
            'description': 'This is product 4',
            'price': 400,
            'images': [
                'https://miamikevbucket.s3.amazonaws.com/remyhat700.png'
            ]
        },
    ]

    for product_data in products_data:
        product = Product(name=product_data['name'], description=product_data['description'], price=product_data['price'])
        for image_url in product_data['images']:
            product.images.append(ProductImage(image_url=image_url))
        db.session.add(product)

    db.session.commit()


def undo_products():
    db.session.execute('TRUNCATE products RESTART IDENTITY CASCADE;')
    db.session.execute('TRUNCATE product_images RESTART IDENTITY CASCADE;')
    db.session.commit()
