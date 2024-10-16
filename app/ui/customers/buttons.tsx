// app/ui/customers/buttons.tsx
'use client'; // Asegúrate de incluir esto al principio del archivo

import { PencilIcon, TrashIcon,PlusIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { deleteClient } from '@/app/lib/actions'; // Asegúrate de que este archivo existe


// Botón para crear un nuevo cliente
export function CreateCustomer() {
  return (
    <Link
      href="/dashboard/customers/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Create Customer</span>
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}
// app/ui/customers/buttons.tsx
export function UpdateInvoice({ id }: { id: string }) {
    return (
      <Link
        href={`/dashboard/customers/${id}/edit`} // Asegúrate de que la ruta sea correcta
        className="rounded-md border p-2 hover:bg-gray-100"
      >
        <span className="sr-only">Edit</span>
        <PencilIcon className="w-5" />
      </Link>
    );
  }
  

// Componente para eliminar
export function DeleteInvoice({ id }: { id: string }) {
  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevenir el comportamiento por defecto del formulario

    if (confirm('Are you sure you want to delete this client?')) {
      await deleteClient(id); // Llamar a la función de eliminación
      window.location.reload(); // Recargar la página para ver los cambios
    }
  };

  return (
    <form onSubmit={handleDelete}>
      <button type="submit" className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-4" />
      </button>
    </form>
  );
}
