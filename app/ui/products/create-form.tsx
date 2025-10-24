'use client';

import { 
    PresentationField, 
    CategoryField, 
    SubcategoryField, 
    UserField 
} from '@/app/lib/definitions';
import {
    QueueListIcon,
    ClipboardDocumentListIcon,
    CurrencyDollarIcon,
    UserCircleIcon,
    TagIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { createProduct, ProductState } from '@/app/lib/actions'; 
import { useState } from 'react';
// CORRECCIÓN: Usamos useFormState, ya que es el nombre tipado correcto 
// para el polyfill de server actions en React 18, importado desde react-dom.
import { useFormState } from 'react-dom';

export default function FormProduct({
    presentations,
    users, 
    categories, 
    subcategories, 
}: {
    presentations: PresentationField[];
    users: UserField[]; 
    categories: CategoryField[]; 
    subcategories: SubcategoryField[]; 
}) {
    const initialState: ProductState = { message: null, errors: {} };
    // CORRECCIÓN: Cambiamos useActionState por useFormState
    const [state, formAction] = useFormState(createProduct, initialState); 

    // Estado para las subcategorías filtradas
    const [filteredSubcategories, setFilteredSubcategories] = useState<SubcategoryField[]>(subcategories);

    // Maneja el cambio de categoría
    const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedCategoryId = event.target.value;
        const filtered = subcategories.filter(subcategory => subcategory.category_id_ref === selectedCategoryId);
        setFilteredSubcategories(filtered);
    };

    return (
        <form action={formAction}>
            <div className="rounded-md bg-gray-50 p-4 md:p-6">
                {/* Presentation Name */}
                <div className="mb-4">
                    <label htmlFor="presentation" className="mb-2 block text-sm font-medium">
                        Choose presentation
                    </label>
                    <div className="relative">
                        <select
                            id="presentation"
                            name="presentation_id"
                            className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            defaultValue=""
                        >
                            <option value="" disabled>
                                Select a presentation
                            </option>
                            {presentations.map((presentation) => (
                                <option key={presentation.presentation_id} value={presentation.presentation_id}>
                                    {presentation.presentation_description}
                                </option>
                            ))}
                        </select>
                        <QueueListIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                    </div>
                    <div id="presentation-error" aria-live="polite" aria-atomic="true">
                        {state.errors?.presentation_id &&
                            state.errors.presentation_id.map((error: string) => (
                                <p className="mt-2 text-sm text-red-500" key={error}>
                                    {error}
                                </p>
                            ))}
                    </div>
                </div>

                {/* Product Description */}
                <div className="mb-4">
                    <label htmlFor="description" className="mb-2 block text-sm font-medium">
                        Enter product description
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <input
                                id="description"
                                name="product_description"
                                type="text"
                                placeholder="Enter product description"
                                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                required
                            />
                            <ClipboardDocumentListIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                        </div>
                    </div>
                </div>

                {/* Cost Price */}
                <div className="mb-4">
                    <label htmlFor="costprice" className="mb-2 block text-sm font-medium">
                        Enter cost price
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <input
                                id="costprice"
                                name="price_costprice"
                                type="number"
                                step="0.01"
                                placeholder="Enter GTQ cost price"
                                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                required
                            />
                            <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                        </div>
                    </div>
                </div>

                {/* Unit Price */}
                <div className="mb-4">
                    <label htmlFor="unitprice" className="mb-2 block text-sm font-medium">
                        Enter unit price
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <input
                                id="unitprice"
                                name="price_unitprice"
                                type="number"
                                step="0.01"
                                placeholder="Enter GTQ unit price"
                                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                required
                            />
                            <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                        </div>
                    </div>
                </div>

                {/* Category Dropdown */}
                <div className="mb-4">
                    <label htmlFor="category" className="mb-2 block text-sm font-medium">
                        Choose a category
                    </label>
                    <div className="relative">
                        <select
                            id="category"
                            name="category_id"
                            className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            defaultValue=""
                            onChange={handleCategoryChange} 
                        >
                            <option value="" disabled>
                                Select a category
                            </option>
                            {categories.map((category) => (
                                <option key={category.category_id} value={category.category_id}>
                                    {category.category_description}
                                </option>
                            ))}
                        </select>
                        <TagIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                    </div>
                    <div id="presentation-error" aria-live="polite" aria-atomic="true">
                        {state.errors?.category_id &&
                            state.errors.category_id.map((error: string) => (
                                <p className="mt-2 text-sm text-red-500" key={error}>
                                    {error}
                                </p>
                            ))}
                    </div>
                </div>

                {/* Subcategory Dropdown */}
                <div className="mb-4">
                    <label htmlFor="subcategory" className="mb-2 block text-sm font-medium">
                        Choose a subcategory
                    </label>
                    <div className="relative">
                        <select
                            id="subcategory"
                            name="subcategory_id"
                            className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            defaultValue=""
                        >
                            <option value="" disabled>
                                Select a subcategory
                            </option>
                            {filteredSubcategories.map((subcategory) => (
                                <option key={subcategory.subcategory_id} value={subcategory.subcategory_id}>
                                    {subcategory.subcategory_description}
                                </option>
                            ))}
                        </select>
                        <TagIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                    </div>
                    <div id="presentation-error" aria-live="polite" aria-atomic="true">
                        {state.errors?.subcategory_id &&
                            state.errors.subcategory_id.map((error: string) => (
                                <p className="mt-2 text-sm text-red-500" key={error}>
                                    {error}
                                </p>
                            ))}
                    </div>
                </div>

                {/* user Dropdown */}
                <div className="mb-4">
                    <label htmlFor="user" className="mb-2 block text-sm font-medium">
                        Choose a user
                    </label>
                    <div className="relative">
                        <select
                            id="user"
                            name="user_id"
                            className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            defaultValue=""
                        >
                            <option value="" disabled>
                                Select a user
                            </option>
                            {users.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.name}
                                </option>
                            ))}
                        </select>
                        <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                    </div>
                    <div id="presentation-error" aria-live="polite" aria-atomic="true">
                        {state.errors?.user_id &&
                            state.errors.user_id.map((error: string) => (
                                <p className="mt-2 text-sm text-red-500" key={error}>
                                    {error}
                                </p>
                            ))}
                    </div>
                </div>
                
                {/* Mensaje de error general (si existe) */}
                <div aria-live="polite" aria-atomic="true" className="mt-2">
                    {state.message ? (
                        <p className="text-sm text-red-500">{state.message}</p>
                    ) : null}
                </div>

                <div className="mt-6 flex justify-end gap-4">
                    <Link
                        href="/dashboard/products"
                        className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                    >
                        Cancel
                    </Link>
                    <Button type="submit">Create Product</Button>
                </div>
            </div>
        </form>
    );
}
