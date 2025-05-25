from sqlalchemy.orm import Session
from app.database import Base, SessionLocal, engine
from app.auth import get_password_hash
from app.models import  User, Product


def seed_data()-> None:
    db: Session = SessionLocal()

    db.query(Product).delete()
    db.query(User).delete()
    db.commit()

    user1 = User(
        username="cjtest123",
        firstname="CJ",
        lastname="Mat",
        email="cj@example.com",
        password=get_password_hash("secret123")
    )

    user2 = User(
        username="usertest2",
        firstname="User",
        lastname="1",
        email="user1e@example.com",
        password=get_password_hash("secret123")
    )

    db.add_all([user1, user2])
    db.commit()

    product1 = Product(
        name="Laptop",
        description="MacBook Pro 14-inch",
        price=2500,
        quantity=5,
        owner=user1
    )

    product2 = Product(
        name="Headphones",
        description="Noise cancelling",
        price=300,
        quantity=10,
        owner=user1
    )
    product3 = Product(
        name="Smartphone",
        description="Latest model smartphone",
        price=999,
        quantity=15,
        owner=user2
    )

    product4 = Product(
        name="Wireless Mouse",
        description="Ergonomic wireless mouse",
        price=45,
        quantity=25,
        owner=user2
    )

    product5 = Product(
        name="Mechanical Keyboard",
        description="RGB backlit mechanical keyboard",
        price=120,
        quantity=12,
        owner=user2
    )

    product6 = Product(
        name="Monitor",
        description="27-inch 4K UHD monitor",
        price=400,
        quantity=8,
        owner=user2
    )

    product7 = Product(
        name="External Hard Drive",
        description="2TB portable external HDD",
        price=80,
        quantity=20,
        owner=user2
    )

    db.add_all([product1, product2, product3, product4, product5, product6, product7])
    db.commit()
    db.close()

    print("✅ Seed data inserted successfully.")

if __name__ == "__main__":
    Base.metadata.create_all(bind=engine)
    seed_data()
