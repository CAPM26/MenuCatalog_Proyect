  import { UpdateProduct, DeleteProduct } from '@/app/ui/products/buttons';
  import { formatDateToLocal, formatCurrency } from '@/app/lib/utils';
  import { fetchFilteredProducts } from '@/app/lib/data';

  export default async function ProductsTable({
    query,
    currentPage,
  }: {
    query: string;
    currentPage: number;
  }) {
    const products = await fetchFilteredProducts(query, currentPage);

    return (
      <div className="mt-6 flow-root">
        <div className="inline-block min-w-full align-middle">
          <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
            <div className="md:hidden">
              {products?.map((product) => (
                <div
                  key={product.product_id}
                  className="mb-2 w-full rounded-md bg-white p-4">
                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <div className="mb-2 flex items-center">
                        <p>{product.product_description}</p>
                      </div>
                      <p className="text-sm text-gray-500">{formatCurrency(product.price_costprice)}</p>
                    </div>
                  </div>
                  <div className="flex w-full items-center justify-between pt-4">
                    <div>
                      <p className="text-xl font-medium">
                        {formatCurrency(product.price_unitprice)}
                      </p>
                      <p>{product.category_description}</p>
                    </div>
                    <div className="flex justify-end gap-2">
                      <UpdateProduct id={product.product_id} />
                      {/* <DeleteProduct id={product.product_id} /> */}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <table className="hidden min-w-full text-gray-900 md:table">
              <thead className="rounded-lg text-left text-sm font-normal">
                <tr>
                  <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                    Presentation
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    Description
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    Cost Price
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    Unit Cost
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    Category
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    Subcategory
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    User
                  </th>
                  <th scope="col" className="relative py-3 pl-6 pr-3">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {products?.map((product) => (
                  <tr
                    key={product.product_id}
                    className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                  >
                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                      <div className="flex items-center gap-3">
                        <p>{product.presentation_description}</p>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      {product.product_description}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      {formatCurrency(product.price_costprice)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      {formatCurrency(product.price_unitprice)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      {product.category_description}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                    {product.subcategory_description}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                    {product.name}
                    </td>
                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                      <div className="flex justify-end gap-3">
                        <UpdateProduct id={product.product_id} />
                        {/* <DeleteProduct id={product.product_id} /> */}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
