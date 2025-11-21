import models
from database import SessionLocal, engine

# Drop all tables to reset schema
models.Base.metadata.drop_all(bind=engine)
models.Base.metadata.create_all(bind=engine)

db = SessionLocal()

def seed_data():
    products = [
        # Electronics (High Demand / Trending)
        models.Product(
            name="iPhone 13 Pro", 
            description="El último iPhone con sistema de cámaras Pro.",
            price=999.00, 
            category="Electrónica",
            rating=4.8,
            reviews=120,
            source="Bolsifyshop", 
            image="https://images.unsplash.com/photo-1632661674596-df8be070a5c5?q=80&w=2070&auto=format&fit=crop",
            sales_count=500,
            season="all"
        ),
        models.Product(
            name="Samsung Galaxy S21", 
            description="Potencia y estilo en un solo dispositivo.",
            price=799.99, 
            discount_price=699.99,
            category="Electrónica",
            rating=4.5,
            reviews=85,
            source="Bolsifyshop", 
            image="https://images.unsplash.com/photo-1610945265078-3858a0828671?q=80&w=2070&auto=format&fit=crop",
            sales_count=300,
            season="all"
        ),
        
        # Christmas (Pre-season)
        models.Product(
            name="Árbol de Navidad Premium", 
            description="Árbol artificial de lujo, 2.10m.",
            price=150.00, 
            category="Hogar",
            rating=4.9,
            reviews=10,
            source="Bolsifyshop", 
            image="https://images.unsplash.com/photo-1544967082-d9d3fdd01a1d?q=80&w=2070&auto=format&fit=crop",
            sales_count=5,
            season="christmas"
        ),
        models.Product(
            name="Luces LED Navideñas", 
            description="10m de luces cálidas para decorar.",
            price=25.00, 
            category="Hogar",
            rating=4.7,
            reviews=5,
            source="Bolsifyshop", 
            image="https://images.unsplash.com/photo-1576692131267-cfb1b476c95c?q=80&w=2070&auto=format&fit=crop",
            sales_count=2,
            season="christmas"
        ),

        # Halloween (Past/Pre-season depending on date, let's treat as Pre-season for demo)
        models.Product(
            name="Disfraz de Fantasma", 
            description="Clásico disfraz para Halloween.",
            price=30.00, 
            category="Moda",
            rating=4.5,
            reviews=20,
            source="Bolsifyshop", 
            image="https://images.unsplash.com/photo-1635452066867-4e07b0c306b4?q=80&w=2070&auto=format&fit=crop",
            sales_count=15,
            season="halloween"
        ),

        # Summer (Past-season)
        models.Product(
            name="Bañador Tropical", 
            description="Estilo y comodidad para la playa.",
            price=45.00, 
            discount_price=25.00,
            category="Moda",
            rating=4.2,
            reviews=40,
            source="Bolsifyshop", 
            image="https://images.unsplash.com/photo-1565945887714-d5160d68f5d9?q=80&w=2070&auto=format&fit=crop",
            sales_count=10,
            season="summer"
        ),

        # Clearance (Low sales + Discount)
        models.Product(
            name="Funda Móvil Antigua", 
            description="Para modelos anteriores.",
            price=15.00, 
            discount_price=5.00,
            category="Accesorios",
            rating=3.5,
            reviews=2,
            source="Bolsifyshop", 
            image="https://images.unsplash.com/photo-1586105251261-72a756497a11?q=80&w=2158&auto=format&fit=crop",
            sales_count=1,
            season="all"
        ),
        models.Product(
            name="Cable USB Genérico", 
            description="Cable de carga básico.",
            price=10.00, 
            discount_price=3.00,
            category="Electrónica",
            rating=3.0,
            reviews=1,
            source="Bolsifyshop", 
            image="https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=2070&auto=format&fit=crop",
            sales_count=0,
            season="all"
        ),
    ]

    for product in products:
        db.add(product)
    
    db.commit()
    print("Database seeded successfully with rich data!")

if __name__ == "__main__":
    seed_data()
