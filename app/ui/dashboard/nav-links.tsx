'use client';
import {
  BuildingOfficeIcon,
  HomeIcon,
  DocumentDuplicateIcon,
  ArchiveBoxIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: 'Home', 
    href: '/dashboard', 
    icon: HomeIcon },
  {
    name: 'Invoices',
    href: '/dashboard/invoices',
    icon: DocumentDuplicateIcon,
  },
  { name: 'Establishments', 
    href: '/dashboard/customers', 
    icon: BuildingOfficeIcon 
  },
  { name: 'Products', 
    href: '/dashboard/products', 
    icon: ArchiveBoxIcon 
  },
  { name: 'Menus', 
    href: '/dashboard/menus', 
    icon: DocumentTextIcon 
  },
 
];

export default function NavLinks() {
  const pathname = usePathname();
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex h-[80px] grow items-center justify-center gap-2 rounded-md bg-dimgray-500 p-4 text-base font-medium hover:bg-blue-600  md:flex-none md:justify-start md:p-3 md:px-4 text-white',
              {
                'bg-dimgray-500 text-blue-600': pathname === link.href,
              },
            )}
          >
            <LinkIcon className="w-12" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
