// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  image_url: string;

  
};

export type Invoice = {
  id: string;
  customer_id: string;
  amount: number;
  date: string;
  // In TypeScript, this is called a string union type.
  // It means that the "status" property can only be one of the two strings: 'pending' or 'paid'.
  status: 'pending' | 'paid';
};

export type Product = {
  product_id: string;
  presentation_id: string;
  category_id: string;
  subcategory_id: string;
  user_id: string;
  product_description: string;
  price_costprice: number;
  price_unitprice: number;
};

export type Revenue = {
  month: string;
  revenue: number;
};

export type LatestInvoice = {
  id: string;
  name: string;
  image_url: string;
  email: string;
  amount: string;
};

// The database returns a number for amount, but we later format it to a string with the formatCurrency function
export type LatestInvoiceRaw = Omit<LatestInvoice, 'amount'> & {
  amount: number;
};

export type InvoicesTable = {
  id: string;
  customer_id: string;
  name: string;
  email: string;
  image_url: string;
  date: string;
  amount: number;
  status: 'pending' | 'paid';
};

export type ClientTable = {
client_id: string;
client_name: string;
client_phone: string;
client_direction: string;
};

export type ProductsTable = {
  product_id: string;
  presentation_description: string;
  product_description: string;
  price_costprice: number;
  price_unitprice: number;
  category_description: string;
  subcategory_description: string;
  name: string;
};



export type CustomersTableType = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: number;
  total_paid: number;
  client_id: string;
  client_name: string;
  client_phone: string;
  client_direction: string;
};

export type FormattedCustomersTable = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: string;
  total_paid: string;
};

export type CustomerField = {
  id: string;
  name: string;
};

export type InvoiceForm = {
  id: string;
  customer_id: string;
  amount: number;
  status: 'pending' | 'paid';
};


export type ProductForm = {
  product_id: string;
  presentation_id: string;
  category_id: string;
  subcategory_id: string;
  id: string;
  product_description: string;
  price_costprice: number;
  price_unitprice: number;
  presentation_description: string;
};

export type PresentationField = {
  presentation_id: string;
  presentation_description: string;
};

export type CategoryField = {
  category_id: string;
  category_description: string;
};

export type SubcategoryField = {
  subcategory_id: string;
  subcategory_description: string;
  category_id_ref: string;
};

export type UserField = {
  id: string;
  name: string;
};

//Apartado de objetos del menu 
export type Menu = {
  menu_id: string;
  menu_name: string;
  menu_description: string;
  menu_price: number;
  menu_available: boolean; // Para indicar si el menú está disponible o no
  category_description: string; // Categoría a la que pertenece el menú
};

export type MenuListProduct = {
  menu_id: string;
  product_id: string;
  product_description: string;
  product_quantity: number;
};

export type MenuSideOrder = {
  sideorder_id: string;
  menu_id: string;
  sideorder_description: string;
  sideorder_price: number;
};

export type MenuTable = {
  product_description: string;
  presentation_description: string;
  subcategory_description: string;
  category_description: string;
  total_price: string;
  unitprice: string;
  menulistproduct_quantity: number;
  price_validitydate: string;
  user_name: string;
  menu_id: string;
  product_id: string;
  category_id_ref: string;
  menu_servings: number;
  menu_description: string;
};