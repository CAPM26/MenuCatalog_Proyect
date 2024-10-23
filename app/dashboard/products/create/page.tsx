import Form from '@/app/ui/products/create-form';
import Breadcrumbs from '@/app/ui/products/breadcrumbs';
import { fetchPresentations, fetchUsers, fetchCategories, fetchSubcategories} from '@/app/lib/data';
 
export default async function Page() {
  const presentations = await fetchPresentations();
  const users = await fetchUsers();
  const categories = await fetchCategories();
  const subcategories = await fetchSubcategories();
 
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'products', href: '/dashboard/products' },
          {
            label: 'Create Product',
            href: '/dashboard/products/create',
            active: true,
          },
        ]}
      />
      <Form presentations={presentations} users={users} categories={categories} subcategories={subcategories}/>
    </main>
  );
}