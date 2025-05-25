from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import models, schemas, database, auth

router = APIRouter(tags=["products"],)


@router.get("/products", response_model=list[schemas.Product])
def get_products(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    
    return db.query(models.Product).filter(models.Product.user_id == current_user.id).all()


@router.post("/products", response_model=schemas.Product)
def create_product(
    product: schemas.ProductCreate,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
)-> schemas.Product:
    
    db_product = models.Product(**product.dict(), user_id=current_user.id)
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    
    return db_product


@router.put("/products/{product_id}", response_model=schemas.Product)
def update_product(
    product_id: int,
    updated: schemas.ProductCreate,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
)-> schemas.Product:
    
    product = (
        db.query(models.Product).filter(
            models.Product.id == product_id,
            models.Product.user_id == current_user.id
        ).first()
    )
    
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    for key, value in updated.dict().items():
        setattr(product, key, value)
    
    db.commit()
    db.refresh(product)
    
    return product


@router.delete("/products/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
)-> dict:
    
    product = (
        db.query(models.Product).filter(
            models.Product.id == product_id,
            models.Product.user_id == current_user.id
        ).first()
    )
    
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    db.delete(product)
    db.commit()
    
    return {"detail": "Deleted"}
