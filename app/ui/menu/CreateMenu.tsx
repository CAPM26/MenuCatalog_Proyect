'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/app/ui/button';

export default function CreateMenu({ products, onSubmit }: { products: any[], onSubmit: (formData: FormData) => void }) {
  const [formState, setFormState] = useState({
    menu_description: '',
    selectedProducts: [] as number[], // Para almacenar los IDs de productos seleccionados
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Recoger los datos del formulario
    const formData = new FormData(e.currentTarget as HTMLFormElement);

    // Llamar a la función de creación proporcionada (onSubmit)
    onSubmit(formData);
  };

  const toggleProductSelection = (productId: number) => {
    setFormState(prevState => ({
      ...prevState,
      selectedProducts: prevState.selectedProducts.includes(productId)
        ? prevState.selectedProducts.filter(id => id !== productId)
        : [...prevState.selectedProducts, productId]
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="menu_description">Menu Description</label>
        <input
          id="menu_description"
          name="menu_description"
          value={formState.menu_description}
          onChange={(e) => setFormState({ ...formState, menu_description: e.target.value })}
          required
          className="border rounded px-2 py-1 w-full"
        />
      </div>

      <div>
        <label>Select Products for the Menu:</label>
        <div className="grid grid-cols-2 gap-4">
          {products.map(product => (
            <div key={product.product_id} className="flex items-center">
              <input
                type="checkbox"
                id={`product-${product.product_id}`}
                value={product.product_id}
                onChange={() => toggleProductSelection(product.product_id)}
              />
              <label htmlFor={`product-${product.product_id}`} className="ml-2">
                {product.product_description} - {product.presentation_description} ({product.subcategory_description}, {product.category_description})
              </label>
            </div>
          ))}
        </div>
      </div>

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Create Menu
      </button>
    </form>
  );
}
