import { AcademicCapIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';

export default function AcmeLogo() {
  return (
    <div
      className={`${lusitana.className} flex flex-row items-center leading-none text-white`}
    >
      <AcademicCapIcon className="h-14 w-14" />
      <p className="text-[26px]">Grupo #1</p>
    </div>
  );
}
