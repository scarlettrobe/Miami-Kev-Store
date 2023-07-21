from flask import Blueprint, jsonify, request
from app.models import BlogPost, db
from app.forms.BlogPost import BlogPostForm
from flask_login import login_required, current_user
from app.api.auth_routes import validation_errors_to_error_messages

blog_routes = Blueprint('blog', __name__)


@blog_routes.route('/', methods=['GET'])
def get_all_blog_posts():
    try:
        posts = BlogPost.query.all()
        return jsonify([post.to_dict() for post in posts])
    except Exception as e:
        print(e)  
        return jsonify(error=str(e)), 500

@blog_routes.route('/<int:id>', methods=['GET'])
def get_blog_post_by_id(id):
    post = BlogPost.query.get(id)
    if post:
        return jsonify(post.to_dict())
    else:
        return jsonify({'error': 'Blog post not found'}), 404
    
@blog_routes.route('', methods=['POST'])
@login_required
def create_blog_post():
    data = request.json
    form = BlogPostForm(data=data)
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        post = BlogPost(
            title=form.title.data,
            content=form.content.data,
        )  
        db.session.add(post)
        db.session.commit()

        return jsonify(post.to_dict()), 201
    
    print(f"Form validation errors: {validation_errors_to_error_messages(form.errors)}")
    return jsonify({'error': 'Invalid data', 'errors': validation_errors_to_error_messages(form.errors)}), 400



@blog_routes.route('/<int:id>', methods=['PUT', 'PATCH'])
@login_required
def update_blog_post(id):
    """
    Update an existing blog post with the JSON data
    """
    post = BlogPost.query.get(id)
    if not post:
        return jsonify({'error': 'Blog post not found'}), 404

    data = request.json
    form = BlogPostForm(data=data)
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        title = form.title.data
        content = form.content.data

        post.title = title
        post.content = content

        db.session.commit()

        return jsonify(post.to_dict()), 200

    print(f"Form validation errors: {validation_errors_to_error_messages(form.errors)}")
    return jsonify({'error': 'Invalid data', 'errors': validation_errors_to_error_messages(form.errors)}), 400





@blog_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_blog_post(id):
    post = BlogPost.query.get(id)
    if not post:
        return jsonify({'error': 'Blog post not found'}), 404

    db.session.delete(post)
    db.session.commit()
    return jsonify({'message': 'Blog post deleted successfully'}), 200
