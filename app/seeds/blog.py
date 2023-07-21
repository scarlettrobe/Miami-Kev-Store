from app.models import BlogPost, db

def seed_blog_posts():
    post1 = BlogPost(title='Merch Update', content='New t-shirt designs have been added to the store!')
    post2 = BlogPost(title='Event Announcement', content='We will be hosting a live Q&A next week.')

    db.session.add(post1)
    db.session.add(post2)

    db.session.commit()

def undo_blog_posts():
    db.session.execute('TRUNCATE blog_posts;')
    db.session.commit()
