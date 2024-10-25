'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/app/ui/button';
import Link from 'next/link';
import { createMenu, linkProductsToMenu } from '@/app/lib/actions';
import { selectProduct } from '@/app/lib/actions';



export default function CreateMenuForm() {
  const [products, setProducts] = useState<{ presentation_id: string; presentation_description: string }[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<{ product_name: string; quantity: number }[]>([]);
  const [menuDescription, setMenuDescription] = useState('');
  const [errors, setErrors] = useState<string | null>(null);
  const router = useRouter();

  // Cargar lista de productos al montar el componente
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsData = await selectProduct();
        const plainProducts = productsData.map((product: any) => ({
          presentation_id: product.presentation_id.toString(), // Asegurarse de que los IDs sean strings
          presentation_description: product.presentation_description,
        }));
        setProducts(plainProducts);
      } catch (error) {
        setErrors('Failed to load products. Please try again later.');
      }
    };
    fetchProducts();
  }, []);

  // Manejar la selección de productos y cantidades
  const handleProductChange = (productName: string, quantity: number) => {
    setSelectedProducts((prev) => {
      const existingProduct = prev.find((p) => p.product_name === productName);
      if (existingProduct) {
        // Si el producto ya está seleccionado, actualizar la cantidad
        return prev.map((p) => 
          p.product_name === productName ? { ...p, quantity } : p
        );
      } else {
        // Si no está seleccionado, agregarlo a la lista
        return [...prev, { product_name: productName, quantity }];
      }
    });
  };

  // Manejar el envío del formulario
  const [menuServings, setMenuServings] = useState(1); // Default servings
const [menuTotalCost, setMenuTotalCost] = useState(0); // Default cost

// Manejar el envío del formulario
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!menuDescription) {
    setErrors("Menu description is required.");
    return;
  }

  if (selectedProducts.length === 0) {
    setErrors("You must select at least one product.");
    return;
  }

  // Crear el menú primero, pasando la descripción, porciones y costo total (inicialmente 0)
  const result = await createMenu(menuDescription, menuServings);
  if (!result.success) {
    setErrors("An error occurred while creating the menu.");
    return;
  }

  const menuId = result.menuId;

  // Ahora vincular los productos seleccionados al menú
  for (const product of selectedProducts) {
    const productResult = await linkProductsToMenu(menuId, product.product_name, product.quantity);
    if (!productResult.success) {
      setErrors("An error occurred while linking products to the menu.");
      return;
    }
  }

  console.log("Menu and products linked successfully");
  router.push('/dashboard/menus');
};

const [isProductListOpen, setIsProductListOpen] = useState(false); // Estado para controlar si la lista está desplegada

const toggleProductList = () => {
  setIsProductListOpen(!isProductListOpen); // Alterna entre mostrar y ocultar la lista
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
          value={menuDescription}
          onChange={(e) => setMenuDescription(e.target.value)}
          className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
          required
        />
      </div>

      {/* Porciones del Menú */}
      <div className="mb-4">
        <label htmlFor="menu_servings" className="mb-2 block text-sm font-medium">
          Menu Servings
        </label>
        <input
          id="menu_servings"
          name="menu_servings"
          type="number"
          value={menuServings}
          onChange={(e) => setMenuServings(Number(e.target.value))}
          className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
          required
        />
      </div>


      {/* Selección de Producto */}
    <div className="mb-4">
      <label className="mb-2 block text-sm font-medium">
        Select Products
      </label>
      <button
        type="button"
        onClick={toggleProductList}
        className="w-full mb-2 px-4 py-2 bg-blue-500 text-white rounded-md focus:outline-none hover:bg-blue-600"
      >
        {isProductListOpen ? 'Hide Products' : 'Show Products'}
      </button>

      {/* Lista desplegable de productos */}
      {isProductListOpen && (
        <div className="overflow-y-auto h-60"> {/* Contenedor con scroll */}
        <div className="bg-gray-100 p-4 rounded-md">
            {products.map((product) => (
              <div key={product.presentation_id} className="flex items-center justify-between mb-2">
                <input
                  type="checkbox"
                  id={product.presentation_id}
                  name="product_id"
                  onChange={(e) =>
                    handleProductChange(product.presentation_description, e.target.checked ? 1 : 0)
                  }
                  className="mr-2"
                />
                <label htmlFor={product.presentation_id} className="mr-4">
                  {product.presentation_description}
                </label>
                <input
                  type="number"
                  min="1"
                  defaultValue={1}
                  className="ml-4 w-16 border rounded-md"
                  onChange={(e) =>
                    handleProductChange(product.presentation_description, Number(e.target.value))
                  }
                />
              </div>
            ))}
        </div>
        </div>
      )}
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
