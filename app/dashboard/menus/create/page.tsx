'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/app/ui/button';
import Link from 'next/link';
import { createMenu } from '@/app/lib/actions'; // Debes implementar esta función para el API call
import { ProductForm } from '@/app/lib/definitions'; // Define la estructura de datos para el tipo de producto


export default function Page() {
    return <p>Customers Page</p>;
}
// Este tipo de datos depende de la estructura de tus productos
// Puedes ajustarlo según el diseño de tu API
interface CreateMenuPageProps {
  products: ProductForm[]; // Lista de productos disponibles para seleccionar
}

//export default function CreateMenuForm({ products }: CreateMenuPageProps) {
//  const [errors, setErrors] = useState<string | null>(null);
//  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
//  const [menuDescription, setMenuDescription] = useState<string>('');
//  const router = useRouter();
//
//  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//    event.preventDefault();
//    if (!menuDescription || selectedProducts.length === 0) {
//      setErrors('Please provide a menu description and select at least one product.');
//      return;
//    }
//
//    const formData = new FormData();
//    formData.append('menu_description', menuDescription);
//    formData.append('products', JSON.stringify(selectedProducts)); // Enviar productos seleccionados como un array JSON
//
//    const result = await createMenu(formData); // Debes crear esta función para llamar a la API
//
//    if (result && result.errors) {
//      setErrors(result.errors);
//    } else if (result) {
//      router.push('/dashboard/menus');
//    } else {
//      setErrors('Unexpected error: the function returned no result.');
//    }
//  };
//
//  const toggleProductSelection = (productId: number) => {
//    if (selectedProducts.includes(productId)) {
//      setSelectedProducts(selectedProducts.filter(id => id !== productId));
//    } else {
//      setSelectedProducts([...selectedProducts, productId]);
//    }
//  };
//
//  return (
//    <form onSubmit={handleSubmit}>
//      <div className="rounded-md bg-gray-50 p-4 md:p-6">
//        {errors && (
//          <div className="mb-4 rounded-md bg-red-100 p-2 text-sm text-red-700">
//            {errors}
//          </div>
//        )}
//
//        {/* Descripción del Menú */}
//        <div className="mb-4">
//          <label htmlFor="menu_description" className="mb-2 block text-sm font-medium">
//            Menu Description
//          </label>
//          <input
//            id="menu_description"
//            name="menu_description"
//            type="text"
//            value={menuDescription}
//            onChange={(e) => setMenuDescription(e.target.value)}
//            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
//            required
//          />
//        </div>
//
//        {/* Seleccionar Productos */}
//        <div className="mb-4">
//          <label className="mb-2 block text-sm font-medium">
//            Select Products
//          </label>
//          <div className="grid grid-cols-2 gap-4">
//            {products.map(product => (
//              <div key={product.product_id} className="flex items-center">
//                <input
//                  type="checkbox"
//                  id={`product-${product.product_id}`}
//                  value={product.product_id}
//                  //checked={selectedProducts.includes(product.product_id)}
//                  //onChange={() => toggleProductSelection(product.product_id)}
//                  className="mr-2"
//                />
//                <label htmlFor={`product-${product.product_id}`}>
//                  {product.product_description} - {product.presentation_description}
//                </label>
//              </div>
//            ))}
//          </div>
//        </div>
//      </div>
//
//      <div className="mt-6 flex justify-end gap-4">
//        <Link
//          href="/dashboard/menus"
//          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
//        >
//          Cancel
//        </Link>
//        <Button type="submit">Create Menu</Button>
//      </div>
//    </form>
//  );
//}
//