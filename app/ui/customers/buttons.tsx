// app/ui/customers/buttons.tsx
'use client'; // Asegúrate de incluir esto al principio del archivo

import { PencilIcon, TrashIcon,PlusIcon,MinusIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { deleteClient } from '@/app/lib/actions'; // Asegúrate de que este archivo existe
import Modal from '@/app/ui/modal'; // Asegúrate de importar el componente Modal
import React, { useState } from 'react';


// Botón para crear un nuevo cliente
export function CreateCustomer() {
  return (
    <Link
      href="/dashboard/customers/create"
      className="flex h-10 items-center rounded-lg bg-purple-500 px-4 text-sm font-medium text-white transition-colors hover:bg-purple-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Create Establishment</span>
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
  

  export function DeleteInvoice({ id }: { id: string }) {
    const [isModalOpen, setIsModalOpen] = useState(false); // Estado para manejar la visibilidad del modal
  
    const handleDelete = async () => {
      await deleteClient(id); // Llamar a la función de eliminación
      window.location.reload(); // Recargar la página para ver los cambios
    };
  
    return (
      <>
        <button
          onClick={() => setIsModalOpen(true)} // Abrir el modal al hacer clic
          className="rounded-md border p-2 hover:bg-gray-100"
        >
          <span className="sr-only">Delete</span>
          <MinusIcon className="w-4" />
        </button>
  
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)} // Cerrar el modal
          onConfirm={handleDelete} // Confirmar la eliminación
        />
      </>
    );
  }