import Form from '@/app/ui/customers/edit-forms'; // Asegúrate de que esta ruta sea correcta
import { fetchClientById } from '@/app/lib/data'; // Asegúrate de que esta ruta sea correcta
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const client = await fetchClientById(id);

  if (!client) {
    notFound();
  }

  return (
    <main>
      <h1>Edit Client</h1>
      <Form client={client} />
    </main>
  );
}
