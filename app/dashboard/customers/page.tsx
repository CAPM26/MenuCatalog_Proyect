import Pagination from '@/app/ui/invoices/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/customers/table'; /////////////////////////////////////////////////////////
import { CreateCustomer } from '@/app/ui/customers/buttons';
import { lusitana } from '@/app/ui/fonts'; /////////////////////////////////////////////////////////////
import { Suspense } from 'react';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { fetchInvoicesPages } from '@/app/lib/data';
import { Metadata } from 'next'; ////////////////////////////////////////////////////////////////////
 
export const metadata: Metadata = {
  title: 'Establishments',
};
 
export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;

  const totalPages = await fetchInvoicesPages(query);
 
  return (
    <div className="w-full">
      <div className="w-full h-auto p-4 bg-purple-500">
        <h1 className={`${lusitana.className} mb-2 text-4xl font-bold text-center text-white`}>Establishments</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search establishments..." />
        <CreateCustomer />
      </div>
      <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center ">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}