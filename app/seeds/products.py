from app.models import db, Product, ProductImage


def seed_products():
    products_data = [
        {
            'name': 'Baby Kev Sticker',
            'description': 'Adorable baby version of Kev in PNG format.',
            'price': 100,
            'is_available': True,
            'images': [
                'https://miamikevbucket.s3.amazonaws.com/babykev700.png'
            ]
        },
        {
            'name': 'Drip Kev Sticker',
            'description': 'Kev showing off his stylish side, available in PNG.',
            'price': 200,
            'is_available': True,
            'images': [
                'https://miamikevbucket.s3.amazonaws.com/drip112.png'
            ]
        },
        {
            'name': 'Fish Kev Sticker',
            'description': 'Kev as a playful fish, a unique PNG sticker.',
            'price': 300,
            'is_available': True,
            'images': [
                'https://miamikevbucket.s3.amazonaws.com/fishkev700.png',
            ]
        },
        {
            'name': 'Gunshow Kev Sticker',
            'description': 'Kev showing off his muscles. Available in PNG.',
            'price': 400,
            'is_available': True,
            'images': [
                'https://miamikevbucket.s3.amazonaws.com/gunshow700.png'
            ]
        },
        {
            'name': 'Casino Kev Sticker',
            'description': 'A high-roller Kev in a casino setting. Available in PNG.',
            'price': 500,
            'is_available': True,
            'images': [
                'https://miamikevbucket.s3.amazonaws.com/Kev_Casino_Design.png'
            ]
        },
        {
            'name': 'Fries Kev Sticker',
            'description': 'Kev enjoying a delicious serving of fries. Available in PNG.',
            'price': 600,
            'is_available': True,
            'images': [
                'https://miamikevbucket.s3.amazonaws.com/kevfries112.png'
            ]
        },
        {
            'name': 'Heart Kev Sticker',
            'description': 'Lovely Kev design encapsulated in a heart. Available in PNG.',
            'price': 700,
            'is_available': True,
            'images': [
                'https://miamikevbucket.s3.amazonaws.com/kevheart700.png'
            ]
        },
        {
            'name': 'Kev Emotes Batch',
            'description': 'A batch of expressive Kev emotes. Available in PNG.',
            'price': 800,
            'is_available': True,
            'images': [
                'https://miamikevbucket.s3.amazonaws.com/kevmotesbatch.png'
            ]
        },
        {
            'name': 'Miami Valentine Sticker',
            'description': 'A romantic Miami-themed Kev sticker. Available in PNG.',
            'price': 900,
            'is_available': True,
            'images': [
                'https://miamikevbucket.s3.amazonaws.com/miamivalentine.png'
            ]
        },
        {
            'name': 'Remy Hat Kev Sticker',
            'description': 'Kev sporting a classy Remy hat. Available in PNG.',
            'price': 1000,
            'is_available': True,
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
