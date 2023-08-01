from flask import Blueprint, jsonify, request
from flask_login import login_required
from app.models import Order, OrderItem, Product, db
from app.forms.OrderForm import OrderForm, OrderItemForm, UpdateOrderStatusForm
from app.api.auth_routes import validation_errors_to_error_messages

order_routes = Blueprint('orders', __name__)

@order_routes.route('', methods=['GET'])
@login_required
def get_orders():
    orders = Order.query.all()
    return {'orders': [order.to_dict() for order in orders]}

@order_routes.route('', methods=['POST'])
@login_required
def create_order():
    form = OrderForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        order = Order(
            user_id=form.data['user_id'],
            order_number=form.data['order_number'],
            order_date=form.data['order_date'],
            status=form.data['status'],
            billing_address=form.data['billing_address'],
            shipping_address=form.data['shipping_address'],
            total_price=form.data['total_price']
        )
        for item_form in form.order_items:
            order_item = OrderItem(
                product_id=item_form.data['product_id'],
                quantity=item_form.data['quantity'],
            )
            order.order_items.append(order_item)
        db.session.add(order)
        db.session.commit()
        return order.to_dict()
    return {'errors': validation_errors_to_error_messages(form.errors)}, 400

@order_routes.route('/<int:id>', methods=['GET'])
@login_required
def get_order(id):
    order = Order.query.get(id)
    if order:
        return order.to_dict()
    else:
        return {'errors': ['Order not found']}, 404

@order_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_order(id):
    order = Order.query.get(id)
    if order:
        form = OrderForm()
        form['csrf_token'].data = request.cookies['csrf_token']
        if form.validate_on_submit():
            order.user_id=form.data.get('user_id', order.user_id)
            order.order_number=form.data.get('order_number', order.order_number)
            order.order_date=form.data.get('order_date', order.order_date)
            order.status=form.data.get('status', order.status)
            order.billing_address=form.data.get('billing_address', order.billing_address)
            order.shipping_address=form.data.get('shipping_address', order.shipping_address)
            order.total_price=form.data.get('total_price', order.total_price)
            for item_form in form.order_items:
                order_item = OrderItem.query.get(item_form.data['id'])
                if order_item:
                    order_item.product_id = item_form.data.get('product_id', order_item.product_id)
                    order_item.quantity = item_form.data.get('quantity', order_item.quantity)
            db.session.commit()
            return order.to_dict()
        return {'errors': validation_errors_to_error_messages(form.errors)}, 400
    else:
        return {'errors': ['Order not found']}, 404
    
@order_routes.route('/<int:id>/status', methods=['PUT'])
@login_required
def update_order_status(id):
    order = Order.query.get(id)
    if order:
        form = UpdateOrderStatusForm()
        form['csrf_token'].data = request.cookies['csrf_token']
        if form.validate_on_submit():
            order.status=form.data.get('status', order.status)
            db.session.commit()
            return order.to_dict()
        return {'errors': validation_errors_to_error_messages(form.errors)}, 400
    else:
        return {'errors': ['Order not found']}, 404
    



@order_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_order(id):
    order = Order.query.get(id)
    if order:
        db.session.delete(order)
        db.session.commit()
        return {'message': 'Order deleted'}
    else:
        return {'errors': ['Order not found']}, 404


@order_routes.route('/<int:orderId>/products', methods=['DELETE'])
@login_required
def delete_order_items(orderId):
    try:
        order = Order.query.get(orderId)
        if not order:
            return jsonify({'error': 'Order not found'}), 404

        # Delete order items associated with the order
        order_items = OrderItem.query.filter_by(order_id=orderId).all()
        for item in order_items:
            db.session.delete(item)

        db.session.commit()
        return jsonify({'message': 'Order items deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to delete order items'}), 500


@order_routes.route('/<int:orderId>/products/<int:productId>', methods=['POST'])
def add_product_to_order(orderId, productId):
    data = request.get_json()  # get the request data

    if "quantity" not in data or not isinstance(data['quantity'], int):
        return jsonify({"errors": ["Quantity is required and it must be an integer"]}), 400

    quantity = data['quantity']

    order = Order.query.get(orderId)
    product = Product.query.get(productId)

    if order and product:
        # Check if the product already exists in the order
        order_item = OrderItem.query.filter_by(order_id=orderId, product_id=productId).first()

        if order_item:
            # Product exists, update quantity
            order_item.quantity += quantity
        else:
            # Product does not exist in the order, create a new OrderItem
            order_item = OrderItem(
                order_id=orderId,
                product_id=productId,
                quantity=quantity
            )
            db.session.add(order_item)

        # Update the total price of the order
        order.total_price = 0  # Reset the total price to 0

        # Calculate the total price based on all items in the order
        for item in order.order_items:
            item_product = Product.query.get(item.product_id)
            order.total_price += item_product.price * item.quantity

        db.session.commit()

        return order.to_dict()  # return the updated order
    else:
        return jsonify(order.to_dict()), 200



@order_routes.route('/<int:orderId>/products/<int:productId>', methods=['DELETE'])
def remove_product_from_order(orderId, productId):
    order = Order.query.get(orderId)
    product = Product.query.get(productId)  # get the product that is being removed
    order_item = OrderItem.query.filter_by(order_id=orderId, product_id=productId).first()
    
    if order and order_item and product:
        # Decrease the total price of the order
        order.total_price -= product.price * order_item.quantity

        # Remove the order_item from the order
        db.session.delete(order_item)
        db.session.commit()

        return order.to_dict() 
    else:
        return jsonify({"errors": ["Order, product or order item not found"]}), 400


