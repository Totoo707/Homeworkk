// ✅ Fichier : routes/__tests__/contacts.integration.test.ts
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
// @ts-ignore
import app from '../../server.js';

let mongoServer: MongoMemoryServer;

const mockContact = {
  name: 'Jean Dupont',
  email: 'jean@example.com',
  message: "Bonjour, j'aimerais vous contacter."
};

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe('📬 Intégration Contact', () => {
  it('devrait enregistrer un message de contact (POST /api/contact)', async () => {
    const res = await request(app).post('/api/contact').send(mockContact);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('contactId');
    expect(res.body.message).toBe('Message envoyé avec succès.');
  });

  it('devrait récupérer les messages de contact (GET /api/contact)', async () => {
    await request(app).post('/api/contact').send(mockContact);
    const res = await request(app).get('/api/contact');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(res.body[0]).toMatchObject({ name: mockContact.name });
  });
});
