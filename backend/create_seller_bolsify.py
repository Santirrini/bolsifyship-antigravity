#!/usr/bin/env python3
"""Script to create a seller account for bolsifyshop@hotmail.com"""

from database import SessionLocal
from models import User, Store
from crud import pwd_context
from datetime import datetime

def create_seller():
    db = SessionLocal()
    
    try:
        # Check if user already exists
        existing_user = db.query(User).filter(User.email == "bolsifyshop@hotmail.com").first()
        
        if existing_user:
            print(f"✓ Usuario ya existe: {existing_user.email}")
            print(f"  - ID: {existing_user.id}")
            print(f"  - Rol: {existing_user.role}")
            
            # Check if user has a store
            store = db.query(Store).filter(Store.owner_id == existing_user.id).first()
            
            if not store:
                print("  - Creando tienda...")
                store = Store(
                    name="Bolsifyshop Store",
                    description="Tienda oficial de Bolsifyshop - Los mejores productos de moda y accesorios",
                    owner_id=existing_user.id,
                    logo_url="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200",
                    created_at=datetime.utcnow().isoformat()
                )
                db.add(store)
                
            # Update role to seller
            if existing_user.role != "seller":
                existing_user.role = "seller"
                db.add(existing_user)
            
            db.commit()
            print(f"✓ Usuario actualizado a rol 'seller' con tienda: {store.name}")
            
        else:
            print("Creando nuevo usuario vendedor...")
            
            # Create user
            hashed_password = pwd_context.hash("bolsify123")  # contraseña: bolsify123
            user = User(
                email="bolsifyshop@hotmail.com",
                full_name="Bolsifyshop Vendor",
                hashed_password=hashed_password,
                is_active=1,
                is_admin=0,
                role="seller"
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            
            print(f"✓ Usuario creado: {user.email}")
            print(f"  - ID: {user.id}")
            print(f"  - Contraseña: bolsify123")
            
            # Create store
            store = Store(
                name="Bolsifyshop Store",
                description="Tienda oficial de Bolsifyshop - Los mejores productos de moda y accesorios",
                owner_id=user.id,
                logo_url="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200",
                created_at=datetime.utcnow().isoformat()
            )
            db.add(store)
            db.commit()
            db.refresh(store)
            
            print(f"✓ Tienda creada: {store.name}")
            print(f"  - ID: {store.id}")
        
        print("\n" + "="*60)
        print("CREDENCIALES DE ACCESO:")
        print("="*60)
        print("Email: bolsifyshop@hotmail.com")
        print("Contraseña: bolsify123")
        print("="*60)
        
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_seller()
