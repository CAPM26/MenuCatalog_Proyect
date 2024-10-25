import CreateMenu from '@/app/ui/menu/CreateMenu';

export default function CreateMenuPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="${lusitana.className} bg-purple-500 mb-2 text-4xl font-bold text-center text-white">Create New Menu</h1>
      <CreateMenu />
    </div>
  );
}
