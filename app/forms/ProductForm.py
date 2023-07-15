from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileAllowed, FileRequired
from wtforms import StringField, TextAreaField, FloatField
from wtforms.validators import DataRequired, Optional
from app.api.aws import ALLOWED_EXTENSIONS

class ProductForm(FlaskForm):
    name = StringField('name', validators=[DataRequired()])
    description = TextAreaField('description', validators=[Optional()])
    price = FloatField('price', validators=[DataRequired()])
    images = FileField('images', validators=[Optional(), FileAllowed(list(ALLOWED_EXTENSIONS))])
