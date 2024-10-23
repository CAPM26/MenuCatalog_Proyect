import { NextResponse } from 'next/server';
import { ClientTable } from '@/app/lib/definitions';

let clients: ClientTable[] = [
  { client_id: '1', client_name: 'John Doe', client_phone: '1234567890', client_direction: '123 Main St' },
  { client_id: '2', client_name: 'Jane Smith', client_phone: '0987654321', client_direction: '456 Elm St' },
];

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { id } = params; // Asegúrate de que estás recibiendo el id
  const body: ClientTable = await req.json();

  console.log('Updating client with ID:', id); // Para depuración
  console.log('Request body:', body); // Para depuración

  const clientIndex = clients.findIndex(client => client.client_id === id);
  if (clientIndex === -1) {
    return NextResponse.json({ message: 'Client not found' }, { status: 404 });
  }

  clients[clientIndex] = { ...clients[clientIndex], ...body };
  return NextResponse.json({ message: 'Client updated successfully' });
}
