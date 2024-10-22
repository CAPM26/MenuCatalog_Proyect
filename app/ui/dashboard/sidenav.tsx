import Link from 'next/link';
import NavLinks from '@/app/ui/dashboard/nav-links';
import AcmeLogo from '@/app/ui/acme-logo';
import { PowerIcon } from '@heroicons/react/24/outline';
import { signOut } from '@/auth';

export default function SideNav() {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <Link
        className="mb-2 flex h-20 items-end justify-start rounded-md bg-dimgray-500 p-4 md:h-40"
        href="/"
      >
        <div className="w-32 text-white md:w-40">
          <AcmeLogo />
        </div>
      </Link>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md bg-dimgray-500 md:block relative">
        <form action={async () => {
            'use server';
            await signOut();
          }}>
          <button className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex h-[64px] w-[190px] items-center justify-center gap-2 rounded-md bg-dimgray-500 p-2 text-sm font-medium hover:bg-blue-600 md:flex-none md:justify-start md:p-4 md:px-5 text-white">
            <PowerIcon className="w-8" />
            <div className="hidden md:block text-base font-medium md:p-3 md:px-4 ">Sign Out</div>
          </button>
        </form>
        </div>
        
      </div>
    </div>
  );
}