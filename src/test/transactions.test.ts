import { execSync } from 'node:child_process';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';
import { app } from '../app';

describe('Transaction routes', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all');
    execSync('npm run knex migrate:latest');
  });

  it('should be able to create a new transaction', async () => {
    const response = await request(app.server).post('/transactions').send({
      title: 'New transaction test',
      amount: 4000,
      type: 'credit'
    });

    expect(response.statusCode).toEqual(201);
  });

  it('should be able to list all transactions', async () => {
    const createTransactionResponse = await request(app.server).post('/transactions').send({
      title: 'New transaction test',
      amount: 4000,
      type: 'credit'
    });

    const cookie = createTransactionResponse.get('Set-Cookie');

    const transactionsReponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookie);

    expect(transactionsReponse.statusCode).toEqual(200);
    expect(transactionsReponse.body.transactions).toEqual([
      expect.objectContaining({
        title: 'New transaction test',
        amount: 4000,
      })
    ]);
  });

  it('should be able to get an transaction by id', async () => {
    const createTransactionResponse = await request(app.server).post('/transactions').send({
      title: 'New transaction test',
      amount: 4000,
      type: 'credit'
    });

    const cookie = createTransactionResponse.get('Set-Cookie');

    const transactionsReponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookie);

    const id = transactionsReponse.body.transactions[0].id;
    const response = await request(app.server)
      .get(`/transactions/${id}`)
      .set('Cookie', cookie);

    expect(response.statusCode).toEqual(200);
    expect(response.body.transaction).toEqual(
      expect.objectContaining({
        title: 'New transaction test',
        amount: 4000,
      })
    );
  });

  it('should be able to get transactions summary', async () => {
    const createTransactionResponse = await request(app.server).post('/transactions').send({
      title: 'Credit transaction',
      amount: 4000,
      type: 'credit'
    });

    const cookie = createTransactionResponse.get('Set-Cookie');

    await request(app.server).post('/transactions')
      .set('Cookie', cookie)
      .send({
        title: 'Debit transaction',
        amount: 500,
        type: 'debit'
      });

    const summaryResponse = await request(app.server)
      .get('/transactions/summary')
      .set('Cookie', cookie);

    expect(summaryResponse.statusCode).toEqual(200);

    expect(summaryResponse.body.summary).toEqual(
      expect.objectContaining({
        amount: 3500,
      })
    );
  });
});

