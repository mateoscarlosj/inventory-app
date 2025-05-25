from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from .. import schemas, models, database, auth

router = APIRouter(tags=["users"],)

@router.post("/users/", response_model=schemas.UserResponse)
def create_user(
    user: schemas.UserCreate,
    db: Session = Depends(database.get_db),
)-> schemas.UserResponse:
    
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    hashed_pw = auth.get_password_hash(user.password)
    new_user = models.User(
        username=user.username,
        firstname=user.firstname,
        lastname=user.lastname,
        email=user.email,
        password=hashed_pw,
    )
    
    db.add(new_user)
    db.commit()
    
    db.refresh(new_user)
    
    return new_user

@router.post("/token")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(database.get_db),
):
    
    user = (
        db.query(models.User).filter(
            models.User.username == form_data.username
        ).first()
    )
    if not user or not auth.verify_password(form_data.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = auth.create_access_token(data={"sub": user.username})
    
    return {"access_token": token, "token_type": "bearer"}
