// app/ui/customers/buttons.tsx
'use client'; // Asegúrate de incluir esto al principio del archivo

import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { deleteClient } from '@/app/lib/actions'; // Asegúrate de que este archivo existe

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
