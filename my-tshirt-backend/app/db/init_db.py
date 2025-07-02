from sqlalchemy.orm import Session
from sqlalchemy import text
from app.db.session import SessionLocal

def add_dark_mode_column():
    db: Session = SessionLocal()
    try:
        db.execute(text("ALTER TABLE users ADD COLUMN dark_mode BOOLEAN DEFAULT FALSE"))
        db.commit()
        print("✅ 'dark_mode' column added.")
    except Exception as e:
        print("⚠️ Could not add column (maybe it exists):", e)
    finally:
        db.close()
