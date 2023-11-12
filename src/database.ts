import { knex as setup } from 'knex';

export const knex = setup({
  client: 'sqlite',
  connection: {
    filename: './tmp/db.sqlite'
  },
  useNullAsDefault: true
});