// app/api/customers/route.ts

import { NextResponse } from 'next/server';
import { ClientTable } from '@/app/lib/definitions';

let clients: ClientTable[] = [
  { client_id: '1', client_name: 'John Doe', client_phone: '1234567890', client_direction: '123 Main St' },
  { client_id: '2', client_name: 'Jane Smith', client_phone: '0987654321', client_direction: '456 Elm St' },
];

export async function POST(req: Request) {
  const body: Omit<ClientTable, 'client_id'> = await req.json(); // Omite client_id
  const newClient: ClientTable = {
    client_id: (clients.length + 1).toString(), // Asigna un nuevo ID
    ...body,
  };

  clients.push(newClient); // Agrega el nuevo cliente a la lista
  return NextResponse.json({ message: 'Client created successfully', client: newClient });
}
