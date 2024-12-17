import { z } from 'zod';

const applySchema = z.object({
    name: z.string(),
    email: z.string(),
    phone: z.string(),
    address: z.string(),
    education: z.string(),
    experience: z.string(),
    salary: z.string(),
    choosePosition: z.string(),
    portfolio: z.string(),
    jobId: z.string(),

});
export { applySchema };
