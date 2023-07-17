from flask_wtf import FlaskForm
from wtforms import StringField, FloatField
from wtforms.validators import DataRequired 
from wtforms import FieldList, FormField, IntegerField, SelectField
from wtforms import DateTimeField


class OrderItemForm(FlaskForm):
    product_id = IntegerField('product_id', validators=[DataRequired()])
    quantity = IntegerField('quantity', validators=[DataRequired()])

class OrderForm(FlaskForm):
    user_id = IntegerField('user_id', validators=[DataRequired()])
    order_number = StringField('order_number', validators=[DataRequired()])
    order_date = DateTimeField('order_date', format='%Y-%m-%dT%H:%M:%S', validators=[DataRequired()])
    status = SelectField('status', choices=[('pending_payment', 'Pending Payment'), 
                                            ('failed', 'Failed'), 
                                            ('processing', 'Processing'), 
                                            ('completed', 'Completed'), 
                                            ('on_hold', 'On Hold'), 
                                            ('cancelled', 'Cancelled'), 
                                            ('refunded', 'Refunded')], validators=[DataRequired()])
    billing_address = StringField('billing_address', validators=[DataRequired()])
    shipping_address = StringField('shipping_address', validators=[DataRequired()])
    total_price = FloatField('total_price', validators=[DataRequired()])
    # New Field
    order_items = FieldList(FormField(OrderItemForm), min_entries=1)
