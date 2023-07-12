from flask import Flask, request, jsonify, Blueprint
from flask_login import login_required, current_user
from app.models import db, Product
from app.forms import ProductForm, ImageForm
from .auth_routes import validation_errors_to_error_messages
from .aws import upload_file_to_s3, remove_file_from_s3

products = Blueprint('products', __name__)


@products.route('/', methods=['POST'])
@login_required
def create_product():
    product_form = ProductForm()
    product_form['csrf_token'].data = request.cookies['csrf_token']

    image_form = ImageForm()
    image_form['csrf_token'].data = request.cookies['csrf_token']

    if product_form.validate_on_submit() and image_form.validate_on_submit():
        image = image_form.image.data
        response = upload_file_to_s3(image)

        if "errors" in response:
            return jsonify(response), 400

        new_product = Product(
            name=product_form.data['name'],
            description=product_form.data['description'],
            price=product_form.data['price'],
            image_url=response['url'],
        )
        db.session.add(new_product)
        db.session.commit()

        return jsonify(new_product.serialize()), 201

    errors = {**validation_errors_to_error_messages(product_form.errors),
              **validation_errors_to_error_messages(image_form.errors)}

    return {'errors': errors}, 400

@products.route('/', methods=['GET'])
@login_required
def get_products():
    products = Product.query.all()
    return jsonify([product.serialize() for product in products]), 200

@products.route('/<int:id>', methods=['GET'])
@login_required
def get_product(id):
    product = Product.query.get_or_404(id)
    return jsonify(product.serialize()), 200

@products.route('/<int:id>', methods=['PUT'])
@login_required
def update_product(id):
    product = Product.query.get_or_404(id)
    image = request.files.get('image')

    product_form = ProductForm()
    product_form['csrf_token'].data = request.cookies['csrf_token']

    if image:
        image_form = ImageForm()
        image_form['csrf_token'].data = request.cookies['csrf_token']

        if image_form.validate_on_submit():
            # Delete the old image and upload the new one
            remove_file_from_s3(product.image_url)
            response = upload_file_to_s3(image)

            if "errors" in response:
                return jsonify(response), 400

            product.image_url = response['url']

    if product_form.validate_on_submit():
        product.name = product_form.data.get('name', product.name)
        product.description = product_form.data.get('description', product.description)
        product.price = product_form.data.get('price', product.price)
        db.session.commit()

        return jsonify(product.serialize()), 200

    errors = {**validation_errors_to_error_messages(product_form.errors)}
    if image:
        errors = {**errors, **validation_errors_to_error_messages(image_form.errors)}
        
    return {'errors': errors}, 400

@products.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_product(id):
    product = Product.query.get_or_404(id)
    remove_file_from_s3(product.image_url)
    db.session.delete(product)
    db.session.commit()

    return jsonify({}), 204
