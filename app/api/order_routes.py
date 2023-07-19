from flask import Blueprint, jsonify, request
from app.models import Order, OrderItem, db
from flask_login import login_required
from datetime import datetime

order_routes = Blueprint('orders', __name__)

@order_routes.route('', methods=['GET'])
@login_required
def get_orders():
    orders = Order.query.all()
    return {'orders': [order.to_dict() for order in orders]}

@order_routes.route('', methods=['POST'])
@login_required
def create_order():
    data = request.json
    order = Order(
        user_id=data['user_id'],
        order_number=data['order_number'],
        order_date=datetime.strptime(data['order_date'], '%Y-%m-%dT%H:%M:%S'),
        status=data['status'],
        billing_address=data['billing_address'],
        shipping_address=data['shipping_address'],
        total_price=data['total_price']
    )
    for item_data in data['order_items']:
        order_item = OrderItem(
            product_id=item_data['product_id'],
            quantity=item_data['quantity'],
        )
        order.order_items.append(order_item)
    db.session.add(order)
    db.session.commit()
    order = Order.query.get(order.id)
    return order.to_dict()

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
        data = request.json
        order.user_id=data['user_id'],
        order.order_number=data['order_number'],
        order.order_date=datetime.strptime(data['order_date'], '%Y-%m-%dT%H:%M:%S'),
        order.status=data['status'],
        order.billing_address=data['billing_address'],
        order.shipping_address=data['shipping_address'],
        order.total_price=data['total_price']
        for item_data in data['order_items']:
            order_item = OrderItem.query.get(item_data['id'])
            if order_item:
                order_item.product_id = item_data['product_id']
                order_item.quantity = item_data['quantity']
        db.session.commit()
        order = Order.query.get(id)
        return order.to_dict()
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
