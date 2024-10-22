import CardWrapper from '@/app/ui/dashboard/cards';
// import { Card } from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { lusitana } from '@/app/ui/fonts';
import { fetchCardData } from '@/app/lib/data'; // remove fetchRevenue
import { Suspense } from 'react';
import { RevenueChartSkeleton,
         LatestInvoicesSkeleton,
         CardsSkeleton,
       } from '@/app/ui/skeletons';
 
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
        <h1 className={`${lusitana.className} mb-2 text-3xl font-bold text-center text-white`}>
          Menú del Día
        </h1>
        <p className={`${lusitana.className} text-3xl  text-center text-white font-bold`}>
          Hoy: {formattedDate}
        </p>
      </div>
      
      
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
      <Suspense fallback={<RevenueChartSkeleton />}>
          <RevenueChart />
        </Suspense>
        <Suspense fallback={<LatestInvoicesSkeleton />}>
          <LatestInvoices />
        </Suspense>
      </div>
    </main>
  );
}