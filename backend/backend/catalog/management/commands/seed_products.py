"""
Management command to seed the database with sample products.
"""
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from backend.catalog.models import Product, Store


class Command(BaseCommand):
    help = 'Seeds the database with sample products for development'

    def handle(self, *args, **options):
        User = get_user_model()
        
        # Get or create a default user for the store
        admin_user, created = User.objects.get_or_create(
            email='admin@bolsifyshop.com',
            defaults={
                'name': 'Admin User',
                'is_staff': True,
                'is_superuser': True,
            }
        )
        if created:
            admin_user.set_password('admin123')
            admin_user.save()
            self.stdout.write(self.style.SUCCESS(f'Created admin user: admin@bolsifyshop.com'))
        
        # Get or create a default store
        store, store_created = Store.objects.get_or_create(
            name='Bolsifyshop Official',
            defaults={
                'owner': admin_user,
                'description': 'Tienda oficial de Bolsifyshop',
                'category': 'General',
                'rating': 4.8,
            }
        )
        if store_created:
            self.stdout.write(self.style.SUCCESS(f'Created store: {store.name}'))

        # Sample products data
        products_data = [
            {
                'name': 'Smart Watch Elite',
                'description': 'Reloj inteligente con monitor de salud avanzado y GPS integrado.',
                'price': 299.99,
                'discount_price': 249.99,
                'category': 'Electronics',
                'rating': 4.8,
                'reviews_count': 120,
                'image': 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=1000&auto=format&fit=crop',
                'stock': 50,
            },
            {
                'name': 'Audífonos Noise Cancel Pro',
                'description': 'Sonido inmersivo con cancelación de ruido activa y 30 horas de batería.',
                'price': 199.99,
                'discount_price': 159.99,
                'category': 'Audio',
                'rating': 4.9,
                'reviews_count': 85,
                'image': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop',
                'stock': 100,
            },
            {
                'name': 'Cámara Pro X 4K',
                'description': 'Captura momentos inolvidables en 4K con estabilización óptica.',
                'price': 899.99,
                'discount_price': None,
                'category': 'Photography',
                'rating': 4.7,
                'reviews_count': 45,
                'image': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000&auto=format&fit=crop',
                'stock': 25,
            },
            {
                'name': 'Laptop Ultra Slim 15"',
                'description': 'Potencia y portabilidad con procesador de última generación.',
                'price': 1299.99,
                'discount_price': 1199.99,
                'category': 'Computers',
                'rating': 4.9,
                'reviews_count': 210,
                'image': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1000&auto=format&fit=crop',
                'stock': 30,
            },
            {
                'name': 'Sneakers Urban Flow',
                'description': 'Comodidad y estilo urbano para tu día a día.',
                'price': 129.99,
                'discount_price': 89.99,
                'category': 'Fashion',
                'rating': 4.6,
                'reviews_count': 150,
                'image': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop',
                'stock': 200,
            },
            {
                'name': 'Mochila Tech Pro',
                'description': 'Espacio para todos tus gadgets con compartimento acolchado para laptop.',
                'price': 79.99,
                'discount_price': None,
                'category': 'Accessories',
                'rating': 4.5,
                'reviews_count': 90,
                'image': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1000&auto=format&fit=crop',
                'stock': 150,
            },
            {
                'name': 'Tablet Pro 11"',
                'description': 'Pantalla retina y chip de alto rendimiento para creativos.',
                'price': 799.99,
                'discount_price': 749.99,
                'category': 'Electronics',
                'rating': 4.8,
                'reviews_count': 180,
                'image': 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=1000&auto=format&fit=crop',
                'stock': 40,
            },
            {
                'name': 'Teclado Mecánico RGB',
                'description': 'Switches mecánicos con retroiluminación RGB personalizable.',
                'price': 149.99,
                'discount_price': 119.99,
                'category': 'Gaming',
                'rating': 4.7,
                'reviews_count': 95,
                'image': 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?q=80&w=1000&auto=format&fit=crop',
                'stock': 80,
            },
        ]

        created_count = 0
        for product_data in products_data:
            product, created = Product.objects.get_or_create(
                name=product_data['name'],
                defaults={
                    **product_data,
                    'store': store,
                    'is_active': True,
                }
            )
            if created:
                created_count += 1
                self.stdout.write(f"  Created: {product.name}")
            else:
                # Update existing product's image if it's corrupted or different
                if product_data.get('image') and (not product.image or 'unsplash' not in str(product.image)):
                    product.image.name = product_data['image']
                    product.save(update_fields=['image'])
                    self.stdout.write(f"  Updated image: {product.name}")

        self.stdout.write(self.style.SUCCESS(f'\nSuccessfully created {created_count} products'))
        self.stdout.write(self.style.SUCCESS(f'Total products in database: {Product.objects.count()}'))
