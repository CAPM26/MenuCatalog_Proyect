'use client';

import { ClientTable } from '@/app/lib/definitions';
import { useState } from 'react';
import { Button } from '@/app/ui/button';
import { useRouter } from 'next/navigation';

export default function EditForm({ client }: { client: ClientTable }) {
  const [formData, setFormData] = useState(client);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('Client to update:', formData); // Log para verificar el cliente que se está intentando actualizar

    const response = await fetch(`/api/customers/${formData.client_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json(); // Obtener la respuesta en formato JSON

    if (!response.ok) {
      console.error(data.message); // Log para depuración
      throw new Error(`Failed to update client: ${data.message}`);
    }

    // Redirigir a la tabla principal después de la actualización
    router.push('/dashboard/customers');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Nombre del cliente */}
        <div className="mb-4">
          <label htmlFor="client_name" className="mb-2 block text-sm font-medium">
            Client Name
          </label>
          <input
            id="client_name"
            name="client_name"
            type="text"
            value={formData.client_name}
            onChange={handleChange}
            className="block w-full rounded-md border border-gray-200 py-2 px-3"
            required
          />
        </div>

        {/* Teléfono del cliente */}
        <div className="mb-4">
          <label htmlFor="client_phone" className="mb-2 block text-sm font-medium">
            Phone
          </label>
          <input
            id="client_phone"
            name="client_phone"
            type="text"
            value={formData.client_phone}
            onChange={handleChange}
            className="block w-full rounded-md border border-gray-200 py-2 px-3"
            required
          />
        </div>

        {/* Dirección del cliente */}
        <div className="mb-4">
          <label htmlFor="client_direction" className="mb-2 block text-sm font-medium">
            Direction
          </label>
          <input
            id="client_direction"
            name="client_direction"
            type="text"
            value={formData.client_direction}
            onChange={handleChange}
            className="block w-full rounded-md border border-gray-200 py-2 px-3"
            required
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Button type="button" onClick={() => router.push('/dashboard/clients')}>Cancel</Button>
        <Button type="submit">Update Client</Button>
      </div>
    </form>
  );
}
