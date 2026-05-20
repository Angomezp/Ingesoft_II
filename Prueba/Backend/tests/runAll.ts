import request from 'supertest';
import app from '../src/app';
import { AppDataSource } from '../src/database/data-source';

function fail(msg: string): never {
  console.error('TEST FAILED:', msg);
  process.exitCode = 1;
  throw new Error(msg);
}

async function testLocalidades() {
  console.log('Running localidades test...');
  const sample = [{ NombreCompleto: 'MEDELLIN\\ANT\\COL', AbreviacionCiudad: 'MDE' }];

  (AppDataSource as any).isInitialized = true;
  (AppDataSource as any).getRepository = () => ({
    find: async () => [],
    create: (o: any) => o,
    save: async (items: any) => sample,
  });
  (global as any).fetch = async () => ({ ok: true, json: async () => sample });

  const res = await request(app).get('/localidades');
  if (res.status !== 200) fail(`/localidades returned ${res.status}`);
  if (!Array.isArray(res.body)) fail('/localidades did not return an array');
  if (res.body[0].AbreviacionCiudad !== 'MDE') fail('Unexpected AbreviacionCiudad');
  console.log('Localidades test passed');
}

async function testAuth() {
  console.log('Running auth test...');
  const authPayload = { MensajeResultado: 0, Usuario: 'pam.user', Identificacion: '12345', Nombre: 'Pam User', TokenJWT: 'tok-xyz' };

  (AppDataSource as any).isInitialized = true;
  (AppDataSource as any).getRepository = () => ({
    create: (o: any) => o,
    save: async () => ({ NombreUsuario: 'pam.user', Identificacion: '12345', NombreCompleto: 'Pam User' }),
  });
  (AppDataSource as any).manager = { query: async () => undefined };
  (global as any).fetch = async () => ({ ok: true, status: 200, json: async () => authPayload, text: async () => JSON.stringify(authPayload) });

  const res = await request(app).post('/login').send({ username: 'pam.user', password: 'pwd' }).set('Content-Type', 'application/json');
  if (res.status !== 200) fail(`/login returned ${res.status}`);
  if (!res.body.user) fail('/login did not return user');
  if (res.body.token !== 'tok-xyz') fail('Token mismatch');
  console.log('Auth test passed');
}

async function run() {
  try {
    await testLocalidades();
    await testAuth();
    console.log('ALL BACKEND TESTS PASSED');
    process.exit(0);
  } catch (err:any) {
    console.error('Tests failed:', err?.message ?? err);
    process.exit(1);
  }
}

run();
