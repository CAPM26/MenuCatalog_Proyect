'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
 
const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: 'Please select a customer.',
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status.',
  }),
  date: z.string(),
});
 
const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });
 
export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};
 
export async function deleteClient(id: string) {
  try {
    await sql`DELETE FROM clients WHERE client_id = ${id}`; // Ajusta la consulta según tu base de datos
    revalidatePath('/dashboard/customers'); // Revalida la página de clientes
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to delete client');
  }
}

export async function createInvoice(prevState: State, formData: FormData) {
  // Validate form using Zod
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
 
  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }
 
  // Prepare data for insertion into the database
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];
 
  // Insert data into the database
  try {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch {
    return {
      message: 'Database Error: Failed to Create Invoice.',
    };
  }
  
  
 
  // Revalidate the cache for the invoices page and redirect the user.
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}


// Validación con Zod
const CreateClientSchema = z.object({
  client_name: z.string().min(1, 'Client name is required'),
  client_phone: z.string().optional(),
  client_direction: z.string().optional(),
});

// Función para crear cliente
export async function createCustomer(formData: FormData) {
  // Valida los campos del formulario
  const validatedFields = CreateClientSchema.safeParse({
    client_name: formData.get('client_name'),
    client_phone: formData.get('client_phone'),
    client_direction: formData.get('client_direction'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Client.',
    };
  }

  const { client_name, client_phone, client_direction } = validatedFields.data;

  // Generar el ID automáticamente, puede ser un hash o UUID
  const client_id = generateClientId(client_name); // Función para generar el ID

  try {
    // Inserción en la base de datos
    await sql`
      INSERT INTO clients (client_name, client_phone, client_direction)
    VALUES (${client_name}, ${client_phone}, ${client_direction})
    `;
  } catch {
    return {
      message: 'Database Error: Failed to Create Client.',
    };
  }

  return {
    message: 'Client Created Successfully.',
  };
}

// Función auxiliar para generar el ID del cliente
function generateClientId(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
}






























export async function updateInvoice(
  id: string,
  prevState: State,
  formData: FormData,
) {
  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  console.log(validatedFields);
 
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Invoice.',
    };
  }
 
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
 
  try {
    await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;
  } catch {
    return { message: 'Database Error: Failed to Update Invoice.' };
  }
  
 
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}




const UpdateClient = z.object({
  client_id: z.string().min(1, 'Client ID is required'), // Asegúrate de tener un campo para el ID del cliente.
  client_name: z.string().min(1, 'Client name is required'),
  client_phone: z.string().optional(), // Puedes hacer que el teléfono sea opcional.
  client_direction: z.string().optional(), // Puedes hacer que la dirección sea opcional.
});

export async function updateCustomer(
  id: string, // ID del cliente que deseas actualizar
  prevState: any, // Reemplaza 'any' con el tipo adecuado para tu estado anterior
  formData: FormData,
) {
  // Valida los campos del formulario
  const validatedFields = UpdateClient.safeParse({
    client_id: id,
    client_name: formData.get('client_name'),
    client_phone: formData.get('client_phone'),
    client_direction: formData.get('client_direction'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Client.',
    };
  }

  const { client_id, client_name, client_phone, client_direction } = validatedFields.data;

  try {
    // Actualiza los datos del cliente en la base de datos.
    await sql`
      UPDATE clients
      SET client_name = ${client_name}, client_phone = ${client_phone}, client_direction = ${client_direction}
      WHERE client_id = ${client_id}
    `;
    return { message: 'Cliente actualizado con éxito' }; // Asegúrate de devolver un mensaje de éxito.
  } catch (error) {
    console.error(error);
    return { message: 'Database Error: Failed to Update Client.' }; // Devuelve un mensaje de error en caso de fallo.
  }
}

















export async function deleteInvoice(id: string) {
  // throw new Error('Failed to Delete Invoice');
  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath('/dashboard/invoices');
    return { message: 'Deleted Invoice.' };
  } catch {
    return { message: 'Database Error: Failed to Delete Invoice.' };
  }
  
}

// Define el esquema de validación usando Zod
const FormProductSchema = z.object({
  product_id: z.string(),
  presentation_id: z.string({
    invalid_type_error: 'Please select a presentation.',
  }),
  category_id: z.string({
    invalid_type_error: 'Please select a category.',
  }),
  subcategory_id:z.string({
    invalid_type_error: 'Please select a subcategory.',
  }),
  user_id: z.string({
    invalid_type_error: 'Please select a user.',
  }),
  product_description: z.string({
    invalid_type_error: 'Please enter a valid description',
  }),
  price_costprice: z.coerce
  .number()
  .gt(0, { message: 'Please enter a valid cost price.' }),
  price_unitprice: z.coerce
  .number()
  .gt(0, { message: 'Please enter a valid unit price.' }),
});

// Omitir el ID del producto para crear y actualizar
const CreateProduct = FormProductSchema.omit({ product_id: true });
const UpdateProduct = FormProductSchema.omit({ product_id: true });

// Tipo para manejar el estado de la operación
export type ProductState = {
  errors?: {
    presentation_id?: string[];
    category_id?: string[];
    subcategory_id?: string[];
    user_id?: string[];
    product_description?: string[];
    price_costprice?: string[];
    price_unitprice?: string[];
  };
  message?: string | null;
};

// Función para crear un nuevo producto
export async function createProduct(prevState: ProductState, formData: FormData) {
  // Validar el formulario utilizando Zod
  const validatedFields = CreateProduct.safeParse({
    presentation_id: formData.get('presentation_id'),
    category_id: formData.get('category_id'),
    subcategory_id: formData.get('subcategory_id'),
    user_id: formData.get('user_id'),
    product_description: formData.get('product_description'),
    price_costprice: formData.get('price_costprice'),
    price_unitprice: formData.get('price_unitprice'),
  });

  // Si la validación del formulario falla, devuelve los errores
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Product.',
    };
  }

  // Preparar datos para la inserción en la base de datos
  const { presentation_id, subcategory_id, price_costprice, price_unitprice, product_description, user_id } = validatedFields.data;

  // Inserción en la base de datos usando una transacción
  try {
    await sql`
      WITH new_product AS (
        INSERT INTO products (product_description, presentation_id_ref, subcategory_id_ref)
        VALUES (
          UPPER(${product_description}),
          ${presentation_id},
          ${subcategory_id}
        )
        RETURNING product_id
      )
      INSERT INTO prices (product_id_ref, price_costprice, price_unitprice, price_validitydate, user_id_ref)
      VALUES (
        (SELECT product_id FROM new_product),
        ${price_costprice * 100},
        ${price_unitprice * 100},
        NOW(),
        (SELECT id FROM users WHERE id = ${user_id})
      );
    `;
  } catch (error) {
    console.error('Database Error:', error);
    return {
      message: 'Database Error: Failed to Create Product.',
    };
  }

  // Revalidar la caché para la página de productos y redirigir al usuario
  revalidatePath('/dashboard/products');
  redirect('/dashboard/products');
}


export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

// Función para actualizar un producto
export async function updateProduct(
  id: string,
  prevState: ProductState,
  formData: FormData,
) {
  // Mostrar los datos que se están recibiendo desde el formData
  console.log("Datos recibidos desde el FormData:");
  for (let [key, value] of formData.entries()) {
    console.log(`${key}: ${value}`);
  }

  // Validar el formulario usando Zod
  const validatedFields = UpdateProduct.safeParse({
    presentation_id: formData.get('presentation_id'),
    category_id: formData.get('category_id'),
    subcategory_id: formData.get('subcategory_id'),
    user_id: formData.get('user_id'),
    product_description: formData.get('product_description'),
    price_costprice: formData.get('price_costprice'),
    price_unitprice: formData.get('price_unitprice'),
  });

  // Si la validación del formulario falla, devuelve los errores
  if (!validatedFields.success) {
    console.error("Errores de validación:", validatedFields.error.flatten().fieldErrors);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Product.',
    };
  }

  // Preparar datos para la actualización
  const { presentation_id, price_costprice, price_unitprice, user_id, product_description, subcategory_id } = validatedFields.data;

  try {
    // Actualizar producto y precios en la base de datos
    await sql`
      WITH updated_product AS (
        UPDATE products
        SET 
          product_description = UPPER(${product_description}),
          presentation_id_ref = (SELECT presentation_id FROM presentation WHERE presentation_id = ${presentation_id}),
          subcategory_id_ref = (SELECT subcategory_id 
                                FROM subcategory 
                                JOIN category ON category.category_id = subcategory.category_id_ref
                                WHERE subcategory.subcategory_id = ${subcategory_id})
        WHERE product_id = ${id}
        RETURNING product_id
      )
      UPDATE prices
      SET 
        price_costprice = ${price_costprice * 100},
        price_unitprice = ${price_unitprice * 100},
        price_validitydate = NOW(),
        user_id_ref = (SELECT id FROM users WHERE id = ${user_id})
      WHERE product_id_ref = (SELECT product_id FROM updated_product);
    `;
  } catch (error) {
    console.error('Database Error:', error);
    return { message: 'Database Error: Failed to Update Product.' };
  }

  // Revalidar la caché para la página de productos y redirigir al usuario
  revalidatePath('/dashboard/products');
  redirect('/dashboard/products');
}


export async function deleteProduct(id: string) {
  try {
    // Ejecutar la consulta SQL para borrar el producto
    await sql`DELETE FROM products WHERE product_id = ${id}`;

    // Revalidar la caché de la página de productos
    revalidatePath('/dashboard/products');

    // Retornar mensaje de éxito
    return { message: 'Deleted Product.' };
  } catch (error) {
    console.error('Database Error:', error);

    // Retornar mensaje de error en caso de falla
    return { message: 'Database Error: Failed to Delete Product.' };
  }
}

