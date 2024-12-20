import { sql } from '@vercel/postgres';


import {
  Customer,
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  ProductForm,
  InvoicesTable,
  ProductsTable,
  LatestInvoiceRaw,
  ClientTable,
  Revenue,
  MenuTable,
  PresentationField,
  CategoryField,
  SubcategoryField,
  UserField,
  
} from './definitions';
import { formatCurrency } from './utils';
export const db = sql; // Puedes usar esta exportación en tu data.ts
export async function fetchRevenue() {
  try {

    const data = await sql<Revenue>`SELECT * FROM revenue`;

    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchLatestInvoices() {
  try {
    const data = await sql<LatestInvoiceRaw>`
      SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC
      LIMIT 5`;

    const latestInvoices = data.rows.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));
    return latestInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}

export async function fetchCardData() {
  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
    const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
    const invoiceStatusPromise = sql`SELECT
         SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
         SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
         FROM invoices`;

    const data = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ]);

    const numberOfInvoices = Number(data[0].rows[0].count ?? '0');
    const numberOfCustomers = Number(data[1].rows[0].count ?? '0');
    const totalPaidInvoices = formatCurrency(data[2].rows[0].paid ?? '0');
    const totalPendingInvoices = formatCurrency(data[2].rows[0].pending ?? '0');

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const invoices = await sql<InvoicesTable>`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return invoices.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

export async function fetchInvoicesPages(query: string) {
  try {
    const count = await sql`SELECT COUNT(*)
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`} OR
      invoices.amount::text ILIKE ${`%${query}%`} OR
      invoices.date::text ILIKE ${`%${query}%`} OR
      invoices.status ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

export async function fetchInvoiceById(id: string) {
  try {
    const data = await sql<InvoiceForm>`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount,
        invoices.status
      FROM invoices
      WHERE invoices.id = ${id};
    `;

    const invoice = data.rows.map((invoice) => ({
      ...invoice,
      // Convert amount from cents to dollars
      amount: invoice.amount / 100,
    }));

    return invoice[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

export async function fetchCustomers() {
  try {
    const data = await sql<CustomerField>`
      SELECT
        id,
        name
      FROM customers
      ORDER BY name ASC
    `;

    const customers = data.rows;
    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}
export async function fetchFilteredCustomers(query: string) {
  try {
    const data = await sql<CustomersTableType>`
		SELECT
		  customers.id,
		  customers.name,
		  customers.email,
		  customers.image_url,
		  COUNT(invoices.id) AS total_invoices,
		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
		FROM customers
		LEFT JOIN invoices ON customers.id = invoices.customer_id
		WHERE
		  customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`}
		GROUP BY customers.id, customers.name, customers.email, customers.image_url
		ORDER BY customers.name ASC
	  `;

    const customers = data.rows.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}

export async function fetchFilteredClients(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  try {
    const clients = await sql<ClientTable>`
      SELECT 
        client_id, client_name, client_phone, client_direction
      FROM clients
      WHERE
        client_name ILIKE ${`%${query}%`} OR
        client_phone ILIKE ${`%${query}%`} OR
        client_direction ILIKE ${`%${query}%`}
      ORDER BY client_name ASC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset};
    `;

    return clients.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch clients.');
  }
}




export async function fetchFilteredProducts(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const products = await sql<ProductsTable>`SELECT
  p.product_id, 
  p.product_description, 
  pr.presentation_description, 
  sc.subcategory_description, 
  c.category_description, 
  pcs.price_costprice, 
  pcs.price_unitprice, 
  u.name
  FROM products p
  JOIN presentation pr ON pr.presentation_id = p.presentation_id_ref
  JOIN subcategory sc ON sc.subcategory_id = p.subcategory_id_ref
  JOIN category c ON c.category_id = sc.category_id_ref
  JOIN prices pcs ON p.product_id = pcs.product_id_ref
  JOIN users u ON u.id = pcs.user_id_ref
  WHERE 
    pr.presentation_description ILIKE ${`%${query}%`} OR
    sc.subcategory_description ILIKE ${`%${query}%`} OR
    c.category_description ILIKE ${`%${query}%`} OR
    p.product_description ILIKE ${`%${query}%`} OR
    u.name ILIKE ${`%${query}%`}
  ORDER BY p.product_description ASC
  LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset};

    `;

    return products.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch products.');
  }
}

export async function fetchProductsPages(query: string) {
  try {
    const count = await sql`SELECT COUNT(*)
    FROM products p
    JOIN presentation pr ON pr.presentation_id = p.presentation_id_ref
    JOIN subcategory sc ON sc.subcategory_id = p.subcategory_id_ref
    JOIN category c ON c.category_id = sc.category_id_ref
    JOIN prices pcs ON pcs.product_id_ref = p.product_id
    JOIN users u ON u.id = pcs.user_id_ref
    WHERE
      p.product_description ILIKE ${`%${query}%`} OR
      pr.presentation_description ILIKE ${`%${query}%`} OR
      sc.subcategory_description ILIKE ${`%${query}%`} OR
      c.category_description ILIKE ${`%${query}%`} OR
      u.name ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of products.');
  }
}


export async function fetchProductById(id: string) {
  try {
    const data = await sql<ProductForm>`
      SELECT
        p.product_id,
        pr.presentation_id,
        c.category_id, 
        sc.subcategory_id, 
        u.id,
        p.product_description,  
        pcs.price_costprice, 
        pcs.price_unitprice 
      FROM products p
      JOIN presentation pr ON pr.presentation_id = p.presentation_id_ref
      JOIN subcategory sc ON sc.subcategory_id = p.subcategory_id_ref
      JOIN category c ON c.category_id = sc.category_id_ref
      JOIN prices pcs ON p.product_id = pcs.product_id_ref
      JOIN users u ON u.id = pcs.user_id_ref
      WHERE p.product_id = ${id};
    `;

    console.log('Data fetched from database:', data); 
    const product = data.rows.map((product) => ({
      ...product,
      // Convert cost price and unit price from cents to dollars
      price_costprice: product.price_costprice / 100,
      price_unitprice: product.price_unitprice / 100,
    }));

    return product[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch product.');
  }
}

//estructurar mejor el query para que funcione

export async function fetchFilteredProductReport(query: string) {
  try {
    const menuReport = await sql<MenuTable>`SELECT 
  p.product_description, 
  pr.presentation_description, 
  sc.subcategory_description, 
  c.category_description, 
  mp.menulistproduct_quantity,
  pcs.price_unitprice / 100 AS unitprice, 
  ((mp.menulistproduct_quantity * pcs.price_unitprice)/100) AS total_price,
  pcs.price_validitydate, 
  u.name AS added_by_user, 
  m.menu_description,
  m.menu_id, 
  p.product_id,
  m.menu_servings
FROM products p
JOIN presentation pr ON pr.presentation_id = p.presentation_id_ref
JOIN subcategory sc ON sc.subcategory_id = p.subcategory_id_ref
JOIN category c ON c.category_id = sc.category_id_ref
JOIN prices pcs ON p.product_id = pcs.product_id_ref
JOIN users u ON u.id = pcs.user_id_ref
JOIN menulistproducts mp ON mp.product_id_ref = p.product_id 
JOIN menus m ON m.menu_id = mp.menu_id_ref
WHERE 
    m.menu_description ILIKE ${`%${query}%`}
ORDER BY p.product_description ASC;
    `;

    return menuReport.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch product report.');
  }
}




export async function fetchClientById(id: string): Promise<ClientTable | null> {
  const result = await sql`SELECT * FROM clients WHERE client_id = ${id}`;

  if (result.rows.length === 0) {
      return null; // Si no se encuentra el cliente, retorna null
  }

  // Asumiendo que el resultado tiene la forma esperada
  const client: ClientTable = result.rows[0] as ClientTable; // Asegúrate de que sea del tipo correcto

  return client;
}


export async function fetchCustomerById(id: string): Promise<ClientTable | null> {
  const response = await fetch(`/api/customers/${id}`);
  if (!response.ok) {
    return null;
  }
  return response.json();
}

export async function fetchPresentations() {
  try {
    const data = await sql<PresentationField>`
      SELECT
        presentation_id,
        presentation_description
      FROM presentation
      ORDER BY presentation_description ASC
    `;

    const presentations = data.rows;
    return presentations;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all presentations.');
  }
}

export async function fetchCategories() {
  try {
    const data = await sql<CategoryField>`
      SELECT
        category_id,
        category_description
      FROM category
      ORDER BY category_description ASC
    `;

    const categories = data.rows;
    return categories;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all categories.');
  }
}

export async function fetchSubcategories() {
  try {
    const data = await sql<SubcategoryField>`
      SELECT
        subcategory_id,
        subcategory_description,
        category_id_ref
      FROM subcategory
      ORDER BY subcategory_description ASC
    `;

    const subcategories = data.rows;
    return subcategories;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all subcategories.');
  }
}

export async function fetchUsers() {
  try {
    const data = await sql<UserField>`
      SELECT
        id,
        name
      FROM users
      ORDER BY name ASC
    `;

    const users = data.rows;
    return users;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all users.');
  }
}


export async function fetchEstablishments() {
  try {
    const establishments = await sql`
      SELECT client_id, client_name
      FROM clients
      ORDER BY client_name ASC;
    `;
    return establishments.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch establishments.');
  }
}

export async function fetchMenus() {
  try {
    const menus = await sql`
      SELECT menu_id, menu_description
      FROM menus
      ORDER BY menu_description ASC;
    `;
    return menus.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch menus.');
  }
}
