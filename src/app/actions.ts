'use server';

import * as z from 'zod';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Please enter a valid email address.'),
  message: z.string().min(10, 'Message must be at least 10 characters.'),
});

export async function sendContactMessage(values: z.infer<typeof formSchema>) {
  const validatedFields = formSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: 'Invalid fields!',
    };
  }
  
  const { name, email, message } = validatedFields.data;

  // TODO: Replace this with a real email sending service
  console.log('New Contact Message:');
  console.log('Name:', name);
  console.log('Email:', email);
  console.log('Message:', message);
  console.log('Email for "To": garg.gauri.1020@gmail.com');


  return {
    success: 'Message sent successfully!',
  };
}
