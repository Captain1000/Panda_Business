from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from app.db.session import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserOut, ForgotPasswordRequest, ResetPasswordRequest
from app.core.security import get_password_hash, verify_password, create_access_token
from datetime import timedelta
from typing import Dict

# In-memory token store for demonstration (in production, use Redis or DB)
reset_tokens: Dict[str, str] = {}

import secrets



router = APIRouter()

@router.post("/register", response_model=UserOut)
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed = get_password_hash(user.password)
    new_user = User(name=user.name, email=user.email, hashed_password=hashed)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/token")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    access_token = create_access_token(data={"sub": user.email}, expires_delta=timedelta(minutes=60))
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/forgot-password")
def forgot_password(payload: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Generate a secure random token
    token = secrets.token_urlsafe(32)
    reset_tokens[token] = user.email

    # Simulate email send (print the reset link)
    print(f"[DEBUG] Password reset link: http://localhost:5173/reset-password?token={token}")
    
    return {"message": "Password reset link sent to email (simulated)"}


@router.post("/reset-password")
def reset_password(payload: ResetPasswordRequest, db: Session = Depends(get_db)):
    email = reset_tokens.get(payload.token)
    if not email:
        raise HTTPException(status_code=400, detail="Invalid or expired token")

    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.hashed_password = get_password_hash(payload.new_password)
    db.commit()
    del reset_tokens[payload.token]  # Invalidate token after use

    return {"message": "Password updated successfully"}