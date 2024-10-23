import Form from '@/app/ui/products/edit-form';
import Breadcrumbs from '@/app/ui/products/breadcrumbs';
import { fetchProductById, 
    fetchPresentations, 
    fetchUsers, 
    fetchSubcategories, 
    fetchCategories } from '@/app/lib/data';
import { notFound } from 'next/navigation';

 
export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id;
    const [product, presentations, users, categories, subcategories] = await Promise.all([
        fetchProductById(id),
        fetchPresentations(),
        fetchUsers(),
        fetchCategories(),
        fetchSubcategories(),
      ]);

      if (!product) {
        notFound();
      }
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Products', href: '/dashboard/products' },
          {
            label: 'Edit Product',
            href: `/dashboard/products/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form product={product} presentations={presentations} users={users} categories={categories} subcategories={subcategories} />
    </main>
  );
}