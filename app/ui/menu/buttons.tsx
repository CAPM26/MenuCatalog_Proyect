import { PencilIcon, PlusIcon, TrashIcon, MinusCircleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { removeProductFromMenu } from '@/app/lib/actions'; 

export function CreateMenu() {
  return (
    <Link
      href="/dashboard/menus/create" // Asegúrate de que esta ruta sea la correcta para tu formulario de creación de menús
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Create Menu</span> {/* Cambiado a "Create Menu" */}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}


export function UpdateProduct({ id }: { id: string }) {
  
  return (
    <Link
    href={`/dashboard/products/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

interface DeleteProductProps {
  menuId: string;  
  productId: string; 
}

export function DeleteProductM({ menuId, productId }: DeleteProductProps) {
    const DeletedPM = removeProductFromMenu.bind(null, menuId, productId);
  return (
    <form action={DeletedPM}> 
      <button type='submit' className="rounded-md border p-2 hover:bg-gray-100">
      <span className="sr-only">Delete</span>
      <TrashIcon className="w-4" />
      </button>
    </form>

  );
}


