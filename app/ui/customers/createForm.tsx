'use client';

import { useState } from 'react';

export default function CreateCustomerForm({ onSubmit }: { onSubmit: (formData: FormData) => void }) {
  const [formState, setFormState] = useState({
    client_id: '',
    client_name: '',
    client_phone: '',
    client_direction: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Recoger los datos del formulario
    const formData = new FormData(e.currentTarget as HTMLFormElement);

    // Llamar a la función de creación proporcionada (onSubmit)
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="client_id">Client ID</label>
        <input
          id="client_id"
          name="client_id"
          value={formState.client_id}
          onChange={(e) => setFormState({ ...formState, client_id: e.target.value })}
          required
          className="border rounded px-2 py-1 w-full"
        />
      </div>

      <div>
        <label htmlFor="client_name">Client Name</label>
        <input
          id="client_name"
          name="client_name"
          value={formState.client_name}
          onChange={(e) => setFormState({ ...formState, client_name: e.target.value })}
          required
          className="border rounded px-2 py-1 w-full"
        />
      </div>

      <div>
        <label htmlFor="client_phone">Client Phone</label>
        <input
          id="client_phone"
          name="client_phone"
          value={formState.client_phone}
          onChange={(e) => setFormState({ ...formState, client_phone: e.target.value })}
          className="border rounded px-2 py-1 w-full"
        />
      </div>

      <div>
        <label htmlFor="client_direction">Client Direction</label>
        <input
          id="client_direction"
          name="client_direction"
          value={formState.client_direction}
          onChange={(e) => setFormState({ ...formState, client_direction: e.target.value })}
          className="border rounded px-2 py-1 w-full"
        />
      </div>

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Create Customer
      </button>
    </form>
  );
}
