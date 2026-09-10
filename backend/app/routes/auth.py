from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_database
from app.models.user import User
from app.schemas.auth import LoginRequest, TokenResponse
from app.services.auth import verify_password, create_access_token
from app.services.dependencies import require_role

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post("/login", response_model=TokenResponse)
def login(
    login_data: LoginRequest,
    db: Session = Depends(get_database)
):
    user = db.query(User).filter(
        User.email == login_data.email
    ).first()

    if not user or not verify_password(
        login_data.password,
        user.hashed_password
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    access_token = create_access_token(
        {
            "sub": str(user.user_id),
            "role": user.role
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

@router.get("/admin-test")
def admin_test(
    current_user = Depends(require_role("admin"))
):
    return {
        "message": "Admin access granted",
        "user_id": current_user.user_id,
        "role": current_user.role
    }