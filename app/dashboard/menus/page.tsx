import Pagination from '@/app/ui/invoices/pagination';
import MenuPagination from '@/app/ui/menu/pagination'; 
//import Pagination from '@/app/ui/invoices/pagination';
import Search from '@/app/ui/search';
import MenuTable from '@/app/ui/menu/table';
import { CreateMenu } from '@/app/ui/menu/buttons';
import { lusitana } from '@/app/ui/fonts';
import { Suspense } from 'react';
import { MenuTableSkeleton } from '@/app/ui/skeletons';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Menu Items',
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

  return (
    <div className="w-full">
      {/* Contenedor principal centrado */}
      <div className="w-full h-auto p-4 bg-purple-500">
        <h1 className={`${lusitana.className} mb-2 text-4xl font-bold text-center text-white`}>Menu Items</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search menu items..." />
        <CreateMenu />
      </div>
      
      {/* Contenedor con scroll solo para el área de la tabla */}
      <div>
        <Suspense key={query + currentPage} fallback={<MenuTableSkeleton />}>
          <MenuTable query={query} />
        </Suspense>
      </div>
      
      <div className="mt-5 flex w-full justify-center">
        {/*<Pagination totalPages={totalPages} />*/}
      </div>
    </div>
  );
}

