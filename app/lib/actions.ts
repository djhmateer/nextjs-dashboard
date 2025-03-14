// marks these functions which are used in client components as server actions
// app/dashboard/invoices/create/page.tsx is a server component
// app/ui/invoices/create-form.tsx is a server component as not using any js hooks 
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// defining the schema for the form that matches the shape of the data in the database
const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  // notice - coerce.number() - converts the amount to a number
  amount: z.coerce.number(),
  status: z.enum(['pending', 'paid']),
  date: z.string(),
});
 
const CreateInvoice = FormSchema.omit({ id: true, date: true });

// Use Zod to update the expected types
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

// this is the function that is called when the form is submitted
// called in the create-form action property
export async function createInvoice(formData: FormData) {
    // const rawFormData = {
    // zod to parse the form data,
    const { customerId, amount, status } = CreateInvoice.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
      });
    
    const amountInCents = amount * 100;
    // date is generated in the server component as YYYY-MM-DD
    const date = new Date().toISOString().split('T')[0];

    try {
      await sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
      `;
    } catch (error) {
      // We'll log the error to the console for now
      console.error(error);
    }

    // fresh data is fetched from the database ie cache is invalidated
    revalidatePath('/dashboard/invoices');
    // redirect to the invoices page

    // this works by throwing an error!?, so can't be inside a try catch block
    redirect('/dashboard/invoices');
}



export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
 
  const amountInCents = amount * 100;
 
  try {
    await sql`
        UPDATE invoices
        SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
        WHERE id = ${id}
      `;
  } catch (error) {
    // We'll log the error to the console for now
    console.error(error);
  }
 
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}


export async function deleteInvoice(id: string) {
  throw new Error('Failed to Delete Invoice');
  
  await sql`DELETE FROM invoices WHERE id = ${id}`;
  revalidatePath('/dashboard/invoices');
}