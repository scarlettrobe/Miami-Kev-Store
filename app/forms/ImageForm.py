"""Forms for the application."""
from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileAllowed, FileRequired
from wtforms import SubmitField
from app.api.aws import ALLOWED_EXTENSIONS

class ImageForm(FlaskForm):
    images = FileField("Image Files", validators=[FileRequired(), FileAllowed(list(ALLOWED_EXTENSIONS))], render_kw={"multiple": True})
    submit = SubmitField("Create Post")
