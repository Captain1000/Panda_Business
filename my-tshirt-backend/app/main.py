from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth, tshirt, custom, admin, order, address, user as user_routes
from app.db.session import Base, engine, SessionLocal
from app.models import tshirt as tshirt_model, custom_design, order as order_model, address as addr_model
from app.models.user import User
from app.core.security import get_password_hash
from sqlalchemy import text
from app.models.order_item import OrderItem

# from app.db.init_db import add_dark_mode_column

# ✅ Manually create order_items table
# with engine.connect() as conn:
#     conn.execute(text("""
#         CREATE TABLE IF NOT EXISTS order_items (
#             id INTEGER PRIMARY KEY AUTOINCREMENT,
#             order_id INTEGER REFERENCES orders(id),
#             item_type TEXT,
#             item_id INTEGER,
#             quantity INTEGER
#         );
#     """))
#     conn.commit()
# add_dark_mode_column()


# Create tables
tshirt_model.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Routers
app.include_router(auth.router, prefix="/auth")
app.include_router(tshirt.router)
app.include_router(custom.router)
app.include_router(admin.router, prefix="/admin")
app.include_router(order.router, tags=["orders"])
app.include_router(address.router)
app.include_router(user_routes.router, prefix="/users")


@app.on_event("startup")
def create_admin_user():
    Base.metadata.create_all(bind=engine)  # Auto-create tables

    db = SessionLocal()
    admin_email = "admin@example.com"
    admin_user = db.query(User).filter(User.email == admin_email).first()

    if not admin_user:
        new_admin = User(
            name="Admin",
            email=admin_email,
            hashed_password=get_password_hash("admin123"),
            role="admin"
        )
        db.add(new_admin)
        db.commit()
        print("✅ Admin user created: admin@example.com / admin123")
    else:
        print("🔒 Admin user already exists.")