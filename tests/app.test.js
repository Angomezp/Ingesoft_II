const request = require('supertest'); 
const app = require('../src/app'); 
 
describe('API Endpoints', () => { 
  test('GET / should return welcome message', async () => { 
    const response = await request(app).get('/'); 
    expect(response.status).toBe(200); 
    expect(response.body.message).toBe('Hola, DevOps!'); 
  }); 
 
  test('GET /health should return OK status', async () => { 
    const response = await request(app).get('/health'); 
    expect(response.status).toBe(200); 
    expect(response.body.status).toBe('OK'); 
  }); 
}); 