"""Script to create demo user account"""
from app.db.database import SessionLocal
from app.models.models import User
from passlib.context import CryptContext

# Create password context directly
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_demo_user():
    db = SessionLocal()
    
    try:
        # Check if demo user already exists
        existing_user = db.query(User).filter(User.email == "demo@realworlded.com").first()
        if existing_user:
            print("✅ Demo user already exists!")
            return
        
        # Create demo user
        demo_user = User(
            email="demo@realworlded.com",
            username="demo_user",
            full_name="Demo User",
            hashed_password=get_password_hash("demo123")
        )
        
        db.add(demo_user)
        db.commit()
        db.refresh(demo_user)
        
        print("✅ Demo user created successfully!")
        print("Email: demo@realworlded.com")
        print("Password: demo123")
        
    except Exception as e:
        print(f"❌ Error creating demo user: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_demo_user()
