'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { ClientTable } from './definitions';
 
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
      INSERT INTO clients (client_id, client_name, client_phone, client_direction)
      VALUES (${client_id}, ${client_name}, ${client_phone}, ${client_direction})
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
