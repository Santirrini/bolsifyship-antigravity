from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import User
import models

# Create tables
models.Base.metadata.create_all(bind=engine)

def activate_admin_user():
    db = SessionLocal()
    try:
        # Find the admin user
        admin = db.query(User).filter(User.email == "admin@bolsifyshop.com").first()
        
        if admin:
            # Activate the user
            admin.is_active = 1
            db.commit()
            print(f"✅ Usuario admin activado exitosamente")
            print(f"   Email: {admin.email}")
            print(f"   Nombre: {admin.full_name}")
            print(f"   Estado: {'Activo' if admin.is_active == 1 else 'Inactivo'}")
            print(f"   Admin: {'Sí' if admin.is_admin == 1 else 'No'}")
            print(f"   Rol: {admin.role}")
        else:
            print("❌ No se encontró el usuario admin@bolsifyshop.com")
            print("\nUsuarios disponibles:")
            users = db.query(User).all()
            for user in users:
                print(f"  - {user.email} (activo: {user.is_active}, admin: {user.is_admin})")
    
    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    activate_admin_user()
