import { NextResponse } from 'next/server';
import { ClientTable } from '@/app/lib/definitions';

let clients: ClientTable[] = [
  { client_id: '1', client_name: 'John Doe', client_phone: '1234567890', client_direction: '123 Main St' },
  { client_id: '2', client_name: 'Jane Smith', client_phone: '0987654321', client_direction: '456 Elm St' },
];

export async function PUT(req: Request, { params }: { params: { name: string } }) {
  const { name } = params; 
  const body: ClientTable = await req.json();

  console.log('Updating client:', name); // Registro para depuración
  console.log('Request body:', body); // Registro para depuración

  const clientIndex = clients.findIndex(client => client.client_name === name);
  if (clientIndex === -1) {
    return NextResponse.json({ message: 'Client not found' }, { status: 404 });
  }

  clients[clientIndex] = { ...clients[clientIndex], ...body };
  return NextResponse.json({ message: 'Client updated successfully' });
}
