'use client';

import { useState } from 'react'; // Importa useState para manejar el estado
import { useRouter } from 'next/navigation'; // Para manejar la navegación
import { Button } from '@/app/ui/button'; // Botón reutilizable
import Link from 'next/link';
import { createCustomer } from '@/app/lib/actions'; // Función para crear cliente

export default function CreateClientForm() {
  const [successMessage, setSuccessMessage] = useState(''); // Estado para el mensaje de éxito
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const result = await createCustomer(formData); // Llama a la función de creación

    if (result && result.errors) {
      console.error(result.errors);
      // Aquí puedes mostrar un mensaje de error en la interfaz.
    } else if (result) {
      console.log(result.message); // Muestra el mensaje de éxito en consola.
      setSuccessMessage('CLIENT SAVED SUCCESSFULLY IN THE DATABASE :)!'); // Actualiza el mensaje de éxito
      setTimeout(() => {
        router.push('/dashboard/customers'); // Redirige a la página de clientes después de 2 segundos
      }, 2000); // Tiempo de espera para la redirección
    } else {
      console.error('Unexpected error: function did not return results.');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="rounded-md bg-gray-50 p-4 md:p-6">
          {/* Nombre del Cliente */}
          <div className="mb-4">
            <label htmlFor="client_name" className="mb-2 block text-sm font-medium">
              Name of Establishment
            </label>
            <input
              id="client_name"
              name="client_name"
              type="text"
              className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
              required
            />
          </div>

          {/* Teléfono del Cliente */}
          <div className="mb-4">
            <label htmlFor="client_phone" className="mb-2 block text-sm font-medium">
              Phone of Establishment
            </label>
            <input
              id="client_phone"
              name="client_phone"
              type="text"
              className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
            />
          </div>

          {/* Dirección del Cliente */}
          <div className="mb-4">
            <label htmlFor="client_direction" className="mb-2 block text-sm font-medium">
              Direction of Establishment
            </label>
            <input
              id="client_direction"
              name="client_direction"
              type="text"
              className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-4">
          <Link
            href="/dashboard/customers"
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            Cancel
          </Link>
          <Button type="submit">Create Establishment</Button>
        </div>
      </form>

      {successMessage && ( // Muestra el mensaje de éxito si está presente
        <div className="mt-4 p-4 text-lg font-bold text-green-800 bg-green-200 rounded-md shadow-md">
          {successMessage}
        </div>
      )}
    </div>
  );
}
