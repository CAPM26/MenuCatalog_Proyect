import { AcademicCapIcon, BookOpenIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';

export default function AcmeLogo() {
  return (
    <div
      className={`${lusitana.className} flex flex-row items-center leading-none text-white`}
    >
      <BookOpenIcon  className="h-14 w-14" />
      <p className="text-[26px]">Catalogo</p>
    </div>
  );
}
