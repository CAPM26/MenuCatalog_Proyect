import CardWrapper from '@/app/ui/dashboard/cards';
// import { Card } from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { lusitana } from '@/app/ui/fonts';
import { fetchCardData } from '@/app/lib/data'; // remove fetchRevenue
import { useEffect, useState, Suspense } from 'react';
import { RevenueChartSkeleton,
         LatestInvoicesSkeleton,
         CardsSkeleton,
       } from '@/app/ui/skeletons';
import { fetchFilteredClients } from '@/app/lib/data';

export default async function Page() {
  // const revenue = await fetchRevenue();
  // const latestInvoices = await fetchLatestInvoices();
  const {
    // numberOfInvoices,
    // numberOfCustomers,
    // totalPaidInvoices,
    // totalPendingInvoices,
  } = await fetchCardData();
  


  const today = new Date();
  const formattedDate = today.toLocaleDateString('es-ES');
  return (
    <main>
      <div className="w-full h-auto p-4 bg-purple-500">
        <h1 className={`${lusitana.className} mb-2 text-4xl font-bold text-center text-white`}>
          Menú del Día
        </h1>
        <p className={`${lusitana.className} text-4xl  text-center text-white font-bold`}>
          Hoy: {formattedDate}
        </p>
      </div>

      <div className='p-5  flex items-center justify-center'> 
        <label className=' mr-4  block mb-2 text-2xl  text-center font-bold'>Selecciona el establecimiento:  </label>
        <div className="flex justify-center">
          <select className="border border-gray-300 rounded text-1xl">
            <option value="establecimiento1">Establecimiento 1</option>
            <option value="establecimiento2">Establecimiento 2</option>
          </select>
        </div>
      </div>
      

      <div className='p-1 flex items-center justify-center'> 
        <label className='mr-4 text-2xl  text-center font-bold'>Selecciona un menú: </label>
        <select className="border border-gray-300 rounded  text-1xl mr-6">
          <option value="menu1">Menú 1</option>
          <option value="menu2">Menú 2</option>
        </select>
        <button
          className="px-4 py-2 bg-purple-500 text-white font-bold rounded hover:bg-purple-400"
        >
          Ver menú
        </button>
      </div>

     
      <div className="p-2 flex items-center justify-center">
        <Suspense fallback={<LatestInvoicesSkeleton />}>
          <LatestInvoices />
        </Suspense>
      </div>
    </main>
  );
}