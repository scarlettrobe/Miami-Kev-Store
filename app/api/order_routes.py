from flask import Blueprint, jsonify, request
from flask_login import login_required
from app.models import Order, OrderItem, db
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
