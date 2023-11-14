import fastify from 'fastify';

const app = fastify();

app.get('/', async () => {
  return '<h1>Hello fastify!</h1>';
});

const PORT = 3333;
app.listen({ port: PORT }).then(() => console.log(`HTTP Server running on port ${PORT}`));