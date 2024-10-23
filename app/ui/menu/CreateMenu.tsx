import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/app/ui/button';
import Link from 'next/link';
import { createMenu } from '@/app/lib/actions';
import { PresentationField} from '@/app/lib/definitions'

export default function CreateMenuForm() {
  const [products, setProducts] = useState([]); // Asegúrate de que esta sea una lista del tipo correcto
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [menuDescription, setMenuDescription] = useState('');
  const [errors, setErrors] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch('/api/products');
      if (!response.ok) {
        setErrors('Failed to load products. Please try again later.');
        return;
      }
      const data = await response.json();
      setProducts(data);
    };
    fetchProducts();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  
    const formData = new FormData(); // Crear una instancia de FormData
  
    // Agregar los datos al FormData
    formData.append('menu_description', menuDescription);
    formData.append('product_id', selectedProduct);
    formData.append('menulistproduct_quantity', quantity.toString()); // Convertir a string
  
    // Validación de campos obligatorios
    if (!menuDescription || !selectedProduct || !quantity) {
      setErrors('All fields are required. Please complete the form.');
      return;
    }
  
    const result = await createMenu(formData); // Pasar el FormData a la función
  
    if (result && result.errors) {
      console.error(result.errors);
    } else {
      router.push('/dashboard/menus'); // Redirige a la página de menús después de la creación
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
            value={menuDescription}
            onChange={(e) => setMenuDescription(e.target.value)}
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
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
            required
          >
            <option value="" disabled>Select a product</option>
            {products.map((product: PresentationField) => (
              <option key={product.presentation_id} value={product.presentation_id}>
                {product.presentation_description} {/* Asumiendo que el precio se almacena en centavos */}
              </option>
            ))}
          </select>
        </div>

        {/* Cantidad */}
        <div className="mb-4">
          <label htmlFor="quantity" className="mb-2 block text-sm font-medium">
            Quantity
          </label>
          <input
            id="quantity"
            name="quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
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
