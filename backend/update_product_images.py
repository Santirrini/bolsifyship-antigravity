#!/usr/bin/env python
"""
Script to update product image URLs with correct external URLs.
Run with: python update_product_images.py
"""
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.local')
sys.path.insert(0, '/home/jose/Documentos/bolsifyship-antigravity/backend')
django.setup()

from backend.catalog.models import Product

products_data = {
    'Smart Watch Elite': 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=1000',
    'Audífonos Noise Cancel Pro': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000',
    'Cámara Pro X 4K': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000',
    'Laptop Ultra Slim 15"': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1000',
    'Sneakers Urban Flow': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000',
    'Mochila Tech Pro': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1000',
    'Tablet Pro 11"': 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=1000',
    'Teclado Mecánico RGB': 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?q=80&w=1000',
}

def main():
    for name, img_url in products_data.items():
        try:
            p = Product.objects.get(name=name)
            p.image.name = img_url  # Directly set the name to the URL
            p.save(update_fields=['image'])
            print(f'Updated: {p.name}')
        except Product.DoesNotExist:
            print(f'Product not found: {name}')
        except Exception as e:
            print(f'Error updating {name}: {e}')
    
    print('\nDone! Verifying...')
    for p in Product.objects.all()[:3]:
        print(f'  {p.name}: {p.image.name if p.image else "No image"}')

if __name__ == '__main__':
    main()
