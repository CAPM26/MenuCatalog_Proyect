'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/app/ui/button';
import Link from 'next/link';
import { createMenu } from '@/app/lib/actions';

interface Product {
  product_id: number;
  product_description: string;
  price_unitprice: number;
}

export default function CreateMenuPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [errors, setErrors] = useState<string | null>(null); // Estado para almacenar errores
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products'); // Cambia esto a tu endpoint que devuelve los productos
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const menuDescription = formData.get('menu_description') as string;
    const productId = formData.get('product_id') as string;
    const quantity = formData.get('menulistproduct_quantity') as string;

    // Validación de campos obligatorios
    if (!menuDescription || !productId || !quantity) {
      setErrors('All fields are required. Please complete the form.');
      return;
    }

    const result = await createMenu(formData);

    if (result && result.errors) {
      console.error(result.errors);
    } else if (result) {
      router.push('/dashboard/menus'); // Redirige a la lista de menús después de la creación
    } else {
      console.error('Unexpected error: the function returned no result.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {errors && (
          <div className="mb-4 rounded-md bg-red-100 p-2 text-sm text-red-700">
            {errors}
          </div>
        )}

        {/* Descripción del Menú */}
        <div className="mb-4">
          <label htmlFor="menu_description" className="mb-2 block text-sm font-medium">
            Menu Description
          </label>
          <input
            id="menu_description"
            name="menu_description"
            type="text"
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
            required
          />
        </div>

        {/* Selección de Producto */}
        <div className="mb-4">
          <label htmlFor="product_id" className="mb-2 block text-sm font-medium">
            Select Product
          </label>
          <select
            id="product_id"
            name="product_id"
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
            required
          >
            <option value="" disabled>Select a product</option>
            {products.map((product) => (
              <option key={product.product_id} value={product.product_id}>
                {product.product_description} - ${product.price_unitprice.toFixed(2)}
              </option>
            ))}
          </select>
        </div>

        {/* Cantidad */}
        <div className="mb-4">
          <label htmlFor="menulistproduct_quantity" className="mb-2 block text-sm font-medium">
            Quantity
          </label>
          <input
            id="menulistproduct_quantity"
            name="menulistproduct_quantity"
            type="number"
            min="1"
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
            required
          />
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/menus"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Create Menu</Button>
      </div>
    </form>
  );
}
