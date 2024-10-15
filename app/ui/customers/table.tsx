import { UpdateInvoice, DeleteInvoice } from '@/app/ui/invoices/buttons'; // Asegúrate de tener los botones adecuados importados
import { fetchFilteredClients } from '@/app/lib/data';

export default async function ClientsTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const clients = await fetchFilteredClients(query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">Name</th>
                <th scope="col" className="px-3 py-5 font-medium">Phone</th>
                <th scope="col" className="px-3 py-5 font-medium">Direction</th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {clients.length > 0 ? (
                clients.map((client) => (
                  <tr
                    key={client.client_id}
                    className="w-full border-b py-3 text-sm last-of-type:border-none"
                  >
                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                      {client.client_name}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      {client.client_phone}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      {client.client_direction}
                    </td>
                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                      <div className="flex justify-end gap-3">
                        <UpdateInvoice id={client.client_id} />
                        <DeleteInvoice id={client.client_id} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-5">
                    No clients found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
