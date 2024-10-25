import { fetchFilteredProductReport } from '@/app/lib/data';
import { formatDateToLocal } from '@/app/lib/utils';
import { DeleteProductM } from './buttons';

export default async function MenuTable({
  query,
  
}: {
  query: string;
  
}) {
  // Ajusta la función para incluir paginación

  const menuItems = await fetchFilteredProductReport(query);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {menuItems?.map((item) => (
              <div
                key={item.product_description}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p>{item.product_description}</p>
                    </div>
                    <p className="text-sm text-gray-500">{item.category_description}</p>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-xl font-medium">
                      {item.unitprice}
                    </p>
                    <p>{formatDateToLocal(item.price_validitydate)}</p>
                  </div>
                  <div className="flex justify-end gap-2">  
                      <DeleteProductM menuId={item.menu_id} productId={item.product_id}/>
                    </div>
                </div>
              </div>
            ))}
          </div>

          <div className="overflow-y-auto max-h-[75vh]"> {/* Contenedor con scroll */}
            <table className="hidden min-w-full text-gray-900 md:table">
              <thead className="rounded-lg text-left text-sm font-normal">
                <tr>
                  <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                    Product
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    Presentation
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    Subcategory
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    Category
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    Quantity
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    Unit Price
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    Total Price
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    Validity Date
                  </th>
                  <th scope="col" className="relative py-3 pl-6 pr-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {menuItems?.map((item) => (
                  <tr
                    key={item.product_description}
                    className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                  >
                    <td className="whitespace-nowrap px-3 py-3">
                      {item.product_description}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      {item.presentation_description}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      {item.subcategory_description}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      {item.category_description}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      {item.menulistproduct_quantity}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      {"Q" + item.unitprice}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      {"Q" + item.total_price}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      {formatDateToLocal(item.price_validitydate)}
                    </td>
                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                      <div className="flex justify-end gap-3">
                        {/* Eliminar producto del menú */}
                        <DeleteProductM menuId={item.menu_id} productId={item.product_id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
