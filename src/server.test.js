
const test = require('node:test');
const assert = require('node:assert/strict');
const app = require('./server');

test('Configuração básica do Node.js', () => {
  assert.equal(typeof process.version, 'string');
});

test('Orçamento sem campos obrigatórios deve ser rejeitado', async () => {
  const server = app.listen(0);

  try {
    await new Promise(resolve => {
      if (server.listening) resolve();
      else server.once('listening', resolve);
    });

    const port = server.address().port;

    const response = await fetch(
      `http://127.0.0.1:${port}/api/orcamentos`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      }
    );

    assert.equal(response.status, 400);

    const data = await response.json();
    assert.ok(data.error);
  } finally {
    await new Promise((resolve, reject) => {
      server.close(err => err ? reject(err) : resolve());
    });
  }
});
test('Painel administrativo deve bloquear acesso sem login', async () => {
  const server = app.listen(0);

  try {
    await new Promise(resolve => {
      if (server.listening) resolve();
      else server.once('listening', resolve);
    });

    const port = server.address().port;

    const response = await fetch(
      `http://127.0.0.1:${port}/api/admin/orcamentos`
    );

    assert.equal(response.status, 401);

    const data = await response.json();
    assert.ok(data.error);
  } finally {
    await new Promise((resolve, reject) => {
      server.close(err => err ? reject(err) : resolve());
    });
  }
});

