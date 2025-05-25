import pytest
from app.auth import get_current_user
from app.database import get_db
from fastapi.testclient import TestClient
from unittest.mock import MagicMock

from app.main import app
from app import models

client = TestClient(app)

mock_user = models.User(id=1, email="user@test.com", password="hashed")



@pytest.fixture
def mock_db_session():
    db = MagicMock()

    def mock_add(instance):
        instance.id = 123

    def mock_refresh(instance):
        pass 

    db.add.side_effect = mock_add
    db.refresh.side_effect = mock_refresh


    product1 = models.Product(
        id=1,
        name="Product1",
        price=100,
        user_id=1,
        description="Lorem Ipsum",
        quantity=20,
    )
    product2 = models.Product(
        id=2,
        name="Product2",
        price=150,
        user_id=1,
        description="Lorem Ipsum",
        quantity=20,
    )

    query_mock = MagicMock()
    query_mock.filter.return_value.all.return_value = [product1, product2]
    db.query.return_value = query_mock
    query_mock.filter.return_value.first.return_value = product1

    return db


@pytest.fixture(autouse=True)
def override_dependencies(mock_db_session):
    app.dependency_overrides[get_current_user] = lambda: mock_user
    app.dependency_overrides[get_db] = lambda: mock_db_session
    yield
    app.dependency_overrides.clear()
    
    
def test_get_products(mock_db_session):
    response = client.get("v1/api/products")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert data[0]["id"] == 1


def test_create_product(mock_db_session):
    product_data = {
        "id": 3,
        "name": "New Product",
        "price": 200,
        "description": "Lorem Ipsum",
        "quantity": 20,
    }
    response = client.post("v1/api/products", json=product_data)
    
    assert response.status_code == 200
    assert response.json()["name"] == "New Product"


def test_update_product(mock_db_session):
    updated_data = {
        "name": "Updated Product",
        "price": 250,
        "description": "Lorem Ipsum",
        "quantity": 20
    }
    response = client.put("v1/api/products/1", json=updated_data)
    assert response.status_code == 200
    assert response.json()["name"] == "Updated Product"
    assert response.json()["price"] == 250


def test_update_product_not_found(mock_db_session):
    mock_db_session.query.return_value.filter.return_value.first.return_value = None
    updated_data = {
        "name": "No Product",
        "price": 0,
        "description": "Lorem Ipsum",
        "quantity": 20
    }
    response = client.put("v1/api/products/999", json=updated_data)
    assert response.status_code == 404
    assert response.json()["detail"] == "Product not found"


def test_delete_product(mock_db_session):
    response = client.delete("v1/api/products/1")
    assert response.status_code == 200
    assert response.json() == {"detail": "Deleted"}


def test_delete_product_not_found(mock_db_session):
    mock_db_session.query.return_value.filter.return_value.first.return_value = None
    
    response = client.delete("v1/api/products/999")
    
    assert response.status_code == 404
    assert response.json()["detail"] == "Product not found"
