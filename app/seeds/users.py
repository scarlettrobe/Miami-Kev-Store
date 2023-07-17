from app.models import User, Product, ProductImage, Order, OrderItem, db
from werkzeug.security import generate_password_hash
from datetime import datetime

def seed_users():
    users_data = [
        {'first_name': 'Demo', 'last_name': 'Lition', 'username': 'Demo1', 'email': 'demo@aa.io', 'password': 'password'},
        {'first_name': 'Marnie', 'last_name': 'Smith', 'username': 'Marnie1', 'email': 'marnie@aa.io', 'password': 'password'},
        {'first_name': 'Bobbie', 'last_name': 'Johnson', 'username': 'Bobbie1', 'email': 'bobbie@aa.io', 'password': 'password'},
        {'first_name': 'Alice', 'last_name': 'Jones', 'username': 'Alice1', 'email': 'alice@aa.io', 'password': 'password'},
        {'first_name': 'Bob', 'last_name': 'Brown', 'username': 'Bob1', 'email': 'bob@aa.io', 'password': 'password'},
        {'first_name': 'Charlie', 'last_name': 'Davis', 'username': 'Charlie1', 'email': 'charlie@aa.io', 'password': 'password'},
        {'first_name': 'David', 'last_name': 'Evans', 'username': 'David1', 'email': 'david@aa.io', 'password': 'password'},
        {'first_name': 'Eva', 'last_name': 'Foster', 'username': 'Eva1', 'email': 'eva@aa.io', 'password': 'password'},
        {'first_name': 'Frank', 'last_name': 'Green', 'username': 'Frank1', 'email': 'frank@aa.io', 'password': 'password'},
        {'first_name': 'Grace', 'last_name': 'Hill', 'username': 'Grace1', 'email': 'grace@aa.io', 'password': 'password'},
    ]

    for user_data in users_data:
        user = User(**user_data)
        db.session.add(user)
    
    db.session.commit()
    

def undo_users():
    db.session.execute('TRUNCATE users RESTART IDENTITY CASCADE;')
    db.session.commit()
