<<<<<<< HEAD
import Pagination from '@/app/ui/menu/pagination';
import Search from '@/app/ui/search';
import MenuTable from '@/app/ui/menu/table';
import { CreateMenu } from '@/app/ui/menu/buttons';
import { lusitana } from '@/app/ui/fonts';
import { Suspense } from 'react';
import { MenuTableSkeleton } from '@/app/ui/skeletons';
import { fetchMenuPages } from '@/app/lib/data';
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

  const totalPages = await fetchMenuPages(query);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Menu Items</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search menu items..." />
        <CreateMenu />
      </div>
      <Suspense key={query + currentPage} fallback={<MenuTableSkeleton />}>
        <MenuTable query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        {/*<Pagination totalPages={totalPages} />*/}
      </div>
    </div>
  );
}
=======
export default function Page() {
    return <p>Menus dfsdfPage</p>;
  }
>>>>>>> 282b9fd01e59e3865ed255f7708aed0dfff377e5
