from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField, FloatField
from wtforms.validators import DataRequired, Optional

class ProductForm(FlaskForm):
    name = StringField('name', validators=[DataRequired()])
    description = TextAreaField('description', validators=[Optional()])
    price = FloatField('price', validators=[DataRequired()])
