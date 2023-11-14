import { randomUUID } from 'node:crypto';
import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { knex } from '../database';

export async function transactionsRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    const transactions = await knex('transactions').select();
    return {
      transactions
    };
  });

  app.get('/:id', async (req) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = paramsSchema.parse(req.params);
    const transaction = await knex('transactions').where('id', id).first();

    return { transaction };
  });

  app.get('/summary', async () => {
    const summary = await knex('transactions').sum('amount', { as: 'amount' }).first();
    return { summary };
  });

  app.post('/', async (req, reply) => {
    const bodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['debit', 'credit']),
    });

    const { title, amount, type } = bodySchema.parse(req.body);

    await knex('transactions')
      .insert({
        id: randomUUID(),
        title,
        amount: type === 'credit' ? amount : (amount * -1)
      });

    return reply.code(201).send();
  });
}