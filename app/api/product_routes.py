from flask import Blueprint, jsonify, request
from flask_login import login_required
from app.models import Product
from app.forms import ProductForm
from app.api.aws import upload_file_to_s3, get_unique_filename, remove_file_from_s3

product_routes = Blueprint('products', __name__)

@product_routes.route('/', methods=['GET', 'POST'])
def products():
    if request.method == 'GET':
        products = Product.query.all()
        return {'products': [product.to_dict() for product in products]}
    if request.method == 'POST':
        form = ProductForm()
        form['csrf_token'].data = request.cookies['csrf_token']
        if form.validate_on_submit():
            product = Product(
                name=form.data['name'],
                description=form.data['description'],
                price=form.data['price'],
                # image_url will be added after image is uploaded to S3
            )
            db.session.add(product)
            db.session.commit()

            if "image" in request.files:
                image = request.files["image"]
                if image.filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS:
                    image.filename = get_unique_filename(image.filename)
                    response = upload_file_to_s3(image)
                    if "errors" not in response:
                        product.image_url = response['url']
                        db.session.commit()
            return product.to_dict()
        return {'errors': validation_errors_to_error_messages(form.errors)}, 400


@product_routes.route('/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def product(id):
    product = Product.query.get(id)
    if not product:
        return {"errors": ["Product not found"]}, 404
    if request.method == 'GET':
        return product.to_dict()
    elif request.method == 'PUT':
        form = ProductForm()
        form['csrf_token'].data = request.cookies['csrf_token']
        if form.validate_on_submit():
            product.name = form.data['name']
            product.description = form.data['description']
            product.price = form.data['price']
            if "image" in request.files:
                image = request.files["image"]
                if image.filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS:
                    if product.image_url:
                        remove_file_from_s3(product.image_url)
                    image.filename = get_unique_filename(image.filename)
                    response = upload_file_to_s3(image)
                    if "errors" not in response:
                        product.image_url = response['url']
            db.session.commit()
            return product.to_dict()
        return {'errors': validation_errors_to_error_messages(form.errors)}, 400
    elif request.method == 'DELETE':
        if product.image_url:
            remove_file_from_s3(product.image_url)
        db.session.delete(product)
        db.session.commit()
        return {"message": "Product deleted"}




# @product_routes.route('/', methods=['POST'])
# @login_required
# def create_product():
#     product_form = ProductForm()
#     product_form['csrf_token'].data = request.cookies['csrf_token']

#     image_form = ImageForm()
#     image_form['csrf_token'].data = request.cookies['csrf_token']

#     if product_form.validate_on_submit() and image_form.validate_on_submit():
#         image = image_form.image.data
#         response = upload_file_to_s3(image)

#         if "errors" in response:
#             return jsonify(response), 400

#         new_product = Product(
#             name=product_form.data['name'],
#             description=product_form.data['description'],
#             price=product_form.data['price'],
#             image_url=response['url'],
#         )
#         db.session.add(new_product)
#         db.session.commit()

#         return jsonify(new_product.serialize()), 201

#     errors = {**validation_errors_to_error_messages(product_form.errors),
#               **validation_errors_to_error_messages(image_form.errors)}

#     return {'errors': errors}, 400

# @product_routes.route('/', methods=['GET'])
# @login_required
# def get_products():
#     products = Product.query.all()
#     return jsonify([product.serialize() for product in products]), 200

# @product_routes.route('/<int:id>', methods=['GET'])
# @login_required
# def get_product(id):
#     product = Product.query.get_or_404(id)
#     return jsonify(product.serialize()), 200

# @product_routes.route('/<int:id>', methods=['PUT'])
# @login_required
# def update_product(id):
#     product = Product.query.get_or_404(id)
#     image = request.files.get('image')

#     product_form = ProductForm()
#     product_form['csrf_token'].data = request.cookies['csrf_token']

#     if image:
#         image_form = ImageForm()
#         image_form['csrf_token'].data = request.cookies['csrf_token']

#         if image_form.validate_on_submit():
#             # Delete the old image and upload the new one
#             remove_file_from_s3(product.image_url)
#             response = upload_file_to_s3(image)

#             if "errors" in response:
#                 return jsonify(response), 400

#             product.image_url = response['url']

#     if product_form.validate_on_submit():
#         product.name = product_form.data.get('name', product.name)
#         product.description = product_form.data.get('description', product.description)
#         product.price = product_form.data.get('price', product.price)
#         db.session.commit()

#         return jsonify(product.serialize()), 200

#     errors = {**validation_errors_to_error_messages(product_form.errors)}
#     if image:
#         errors = {**errors, **validation_errors_to_error_messages(image_form.errors)}
        
#     return {'errors': errors}, 400

# @product_routes.route('/<int:id>', methods=['DELETE'])
# @login_required
# def delete_product(id):
#     product = Product.query.get_or_404(id)
#     remove_file_from_s3(product.image_url)
#     db.session.delete(product)
#     db.session.commit()

#     return jsonify({}), 204