
from flask import Blueprint, jsonify, request
from app.forms.ProductForm import ProductForm
from app.api.aws import upload_file_to_s3, get_unique_filename, remove_file_from_s3, ALLOWED_EXTENSIONS
from app.models import Product, ProductImage, db
from app.api.auth_routes import validation_errors_to_error_messages
from app.models import Product, ProductImage, OrderItem, Order, db





product_routes = Blueprint('products', __name__)



from flask import current_app  # Import current_app

@product_routes.route('', methods=['GET'])
def get_products():
    try:
        products = Product.query.filter_by(is_available=True).all()
        product_list = []
        for product in products:
            product_list.append(product.to_dict())

        # Log the number of products retrieved
        current_app.logger.info(f"Number of products retrieved: {len(product_list)}")

        return {'products': product_list}
    except Exception as e:
        # Log any exceptions that occur during the process
        current_app.logger.error(f"Error occurred while fetching products: {str(e)}")
        return {'error': 'An error occurred while fetching products'}, 500



@product_routes.route('', methods=['POST'])
def create_product():
    form = ProductForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        product = Product(
            name=form.data['name'],
            description=form.data['description'],
            price=form.data['price'],
        )
        db.session.add(product)
        db.session.commit()

        if "images" in request.files:
            for image_file in request.files.getlist("images"):
                if image_file.filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS:
                    image_file.filename = get_unique_filename(image_file.filename)
                    response = upload_file_to_s3(image_file)
                    if "errors" not in response:
                        image = ProductImage(
                            product_id=product.id,
                            image_url=response['url'],
                        )
                        db.session.add(image)
            db.session.commit()
        return product.to_dict()
    return {'errors': validation_errors_to_error_messages(form.errors)}, 400


@product_routes.route('/<int:id>', methods=['GET'])
def get_product(id):
    product = Product.query.get(id)
    if not product:
        return {"errors": ["Product not found"]}, 404
    return product.to_dict()


@product_routes.route('/<int:id>', methods=['PUT'])
def update_product(id):
    product = Product.query.get(id)
    if not product:
        return {"errors": ["Product not found"]}, 404

    form = ProductForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        product.name = form.data['name']
        product.description = form.data['description']
        product.price = form.data['price']

        if "images" in request.files:  # Only process images if they exist
            new_images = []
            for image_file in request.files.getlist("images"):
                filename_parts = image_file.filename.rsplit('.', 1)
                if len(filename_parts) == 2 and filename_parts[1].lower() in ALLOWED_EXTENSIONS:
                    image_file.filename = get_unique_filename(image_file.filename)
                    response = upload_file_to_s3(image_file)
                    if "errors" not in response:
                        image = ProductImage(
                            product_id=product.id,
                            image_url=response['url'],
                        )
                        new_images.append(image)

            if new_images:  # If there are new images, delete old ones and add new ones
                for image in product.images:
                    remove_file_from_s3(image.image_url)
                    db.session.delete(image)
                for image in new_images:
                    db.session.add(image)

        db.session.commit()  # Commit changes whether there are new images or not
        return product.to_dict(), 200

    else:
        return {'errors': validation_errors_to_error_messages(form.errors)}, 400



@product_routes.route('/<int:id>', methods=['DELETE'])
def delete_product(id):
    product = Product.query.get(id)
    if product is None:
        return {"errors": ["Product not found"]}, 404

    product.is_available = False
    db.session.commit()

    return {"message": "Product deleted"}





# from flask import Blueprint, jsonify, request
# from flask_login import login_required
# from app.models import Product
# from app.forms.ProductForm import ProductForm
# from app.api.aws import upload_file_to_s3, get_unique_filename, remove_file_from_s3
# product_routes = Blueprint('products', __name__)


# @product_routes.route('/', methods=['GET', 'POST'])
# def products():
#     if request.method == 'GET':
#         products = Product.query.all()
#         return {'products': [product.to_dict() for product in products]}
#     elif request.method == 'POST':
#         form = ProductForm()
#         form['csrf_token'].data = request.cookies['csrf_token']
#         if form.validate_on_submit():
#             product = Product(
#                 name=form.data['name'],
#                 description=form.data['description'],
#                 price=form.data['price'],
#             )
#             db.session.add(product)
#             db.session.commit()

#             if "images" in request.files:
#                 for image_file in request.files.getlist("images"):
#                     if image_file.filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS:
#                         image_file.filename = get_unique_filename(image_file.filename)
#                         response = upload_file_to_s3(image_file)
#                         if "errors" not in response:
#                             image = ProductImage(
#                                 product_id=product.id,
#                                 image_url=response['url'],
#                             )
#                             db.session.add(image)
#                 db.session.commit()
#             return product.to_dict()
#         return {'errors': validation_errors_to_error_messages(form.errors)}, 400
    

# @product_routes.route('/<int:id>', methods=['GET', 'PUT', 'DELETE'])
# def product(id):
#     product = Product.query.get(id)
#     if not product:
#         return {"errors": ["Product not found"]}, 404
#     if request.method == 'GET':
#         return product.to_dict()
#     elif request.method == 'PUT':
#         form = ProductForm(data=request.get_json())
#         form['csrf_token'].data = request.cookies['csrf_token']
#         if form.validate_on_submit():
#             product.name = form.data['name']
#             product.description = form.data['description']
#             product.price = form.data['price']

#             if "images" in request.files:
#                 # Delete all existing images for this product
#                 for image in product.images:
#                     remove_file_from_s3(image.image_url)
#                     db.session.delete(image)

#                 # Add new images
#                 for image_file in request.files.getlist("images"):
#                     if image_file.filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS:
#                         image_file.filename = get_unique_filename(image_file.filename)
#                         response = upload_file_to_s3(image_file)
#                         if "errors" not in response:
#                             image = ProductImage(
#                                 product_id=product.id,
#                                 image_url=response['url'],
#                             )


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
