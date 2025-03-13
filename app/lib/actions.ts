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

    await sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;

    // fresh data is fetched from the database ie cache is invalidated
    revalidatePath('/dashboard/invoices');
    // redirect to the invoices page
    redirect('/dashboard/invoices');
}