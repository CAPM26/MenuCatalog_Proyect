'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/app/ui/button';
import Link from 'next/link';
import { createCustomer } from '@/app/lib/actions';

export default function CreateClientForm() {
  const [errors, setErrors] = useState<string | null>(null); // Estado para almacenar errores
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const clientName = formData.get('client_name') as string;
    const clientPhone = formData.get('client_phone') as string;
    const clientDirection = formData.get('client_direction') as string;

    // Validación de campos obligatorios
    if (!clientName || !clientPhone || !clientDirection) {
      setErrors('All fields are required. Please complete the form.');
      return;
    }

    const result = await createCustomer(formData);

    if (result && result.errors) {
      console.error(result.errors);
    } else if (result) {
      router.push('/dashboard/customers');
    } else {
      console.error('Unexpected error: the function returned no result.');
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
            required
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
            required
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
  );
}
