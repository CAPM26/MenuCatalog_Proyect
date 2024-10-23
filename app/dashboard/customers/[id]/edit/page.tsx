import Form from '@/app/ui/customers/edit-forms'; // Asegúrate de que esta ruta sea correcta
import { fetchClientById } from '@/app/lib/data'; // Asegúrate de que esta ruta sea correcta
import { notFound } from 'next/navigation';
import { lusitana } from '@/app/ui/fonts'; 

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const client = await fetchClientById(id);

  if (!client) {
    notFound();
  }

  return (
    <main>
      <div className="w-full h-auto p-4 bg-purple-500">
        <h1 className={`${lusitana.className} mb-2 text-4xl font-bold text-center text-white`}>Edit Establishment</h1>
      </div>
      
      <Form client={client} />
    </main>
  );
}
