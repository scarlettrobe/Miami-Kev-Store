from flask import Blueprint, jsonify, request
from app.models import Order, OrderItem, db
from flask_login import login_required

order_routes = Blueprint('orders', __name__)

@order_routes.route('', methods=['GET'])
@login_required
def get_orders():
    """
    Query for all orders and returns them in a list of order dictionaries
    """
    orders = Order.query.all()
    return {'orders': [order.to_dict() for order in orders]}


@order_routes.route('', methods=['POST'])
@login_required
def create_order():
    """
    Create a new order and return the order in a dictionary
    """
    data = request.json
    order = Order(
        user_id=data['user_id'],
        total_price=data['total_price'],
    )
    for item_data in data['order_items']:
        order_item = OrderItem(
            product_id=item_data['product_id'],
            quantity=item_data['quantity'],
        )
        order.order_items.append(order_item)
    db.session.add(order)
    db.session.commit()
    return order.to_dict()


@order_routes.route('/<int:id>', methods=['GET'])
@login_required
def get_order(id):
    """
    Query for an order by id and return that order in a dictionary
    """
    order = Order.query.get(id)
    if order:
        return order.to_dict()
    else:
        return {'errors': ['Order not found']}, 404


@order_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_order(id):
    """
    Update an existing order and return the updated order in a dictionary
    """
    order = Order.query.get(id)
    if order:
        data = request.json
        order.total_price = data['total_price']
        for item_data in data['order_items']:
            order_item = OrderItem.query.get(item_data['id'])
            if order_item:
                order_item.product_id = item_data['product_id']
                order_item.quantity = item_data['quantity']
        db.session.commit()
        return order.to_dict()
    else:
        return {'errors': ['Order not found']}, 404


@order_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_order(id):
    """
    Delete an order by id
    """
    order = Order.query.get(id)
    if order:
        db.session.delete(order)
        db.session.commit()
        return {'message': 'Order deleted'}
    else:
        return {'errors': ['Order not found']}, 404
