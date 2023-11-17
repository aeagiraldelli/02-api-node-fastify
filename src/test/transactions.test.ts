import { afterAll, beforeAll, expect, test } from 'vitest';
import request from 'supertest';
import { app } from '../app';

beforeAll(async () => {
  await app.ready();
});

afterAll(async () => {
  await app.close();
});

test('user can create a new transaction', async () => {
  const response = await request(app.server).post('/transactions').send({
    title: 'New transaction test',
    amount: 4000,
    type: 'credit'
  });

  expect(response.statusCode).toEqual(201);
});