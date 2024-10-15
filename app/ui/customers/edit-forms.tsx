'use client';

import { useRouter } from 'next/navigation'; // Importa useRouter
import { ClientTable } from '@/app/lib/definitions';
import { Button } from '@/app/ui/button';
import Link from 'next/link';
import { updateCustomer } from '@/app/lib/actions';

export default function EditClientForm({ client }: { client: ClientTable }) {
  const router = useRouter(); // Inicializa el enrutador

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const result = await updateCustomer(client.client_id, {}, formData);

    if (result && result.errors) {
      console.error(result.errors);
      // Aquí puedes mostrar un mensaje de error en la interfaz.
    } else if (result) {
      console.log(result.message); // Muestra el mensaje de éxito en consola.
      // Redirige a la página principal o a la lista de clientes
      router.push('/dashboard/customers'); // Cambia la ruta según tu estructura de aplicación.
    } else {
      console.error('Error inesperado: la función no devolvió resultados.');
    }
  };

  return (
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
            defaultValue={client.client_name}
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
            defaultValue={client.client_phone}
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
            defaultValue={client.client_direction}
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
        <Button type="submit">Edit Establishment</Button>
      </div>
    </form>
  );
}
