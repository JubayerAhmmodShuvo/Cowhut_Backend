import { z } from 'zod';

const loginZodSchema = z.object({
  body: z.object({
    phone: z.number({
      required_error: 'Phone number is required',
    }),
    password: z.string({
      required_error: 'Password is required',
    }),
  }),
});



export const AuthValidation = {
  loginZodSchema,
  
};
