import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
// @ts-ignore
import app from '../../server.js';

const mockArticle = {
  titre: 'Titre de test',
  auteur: 'Auteur Test',
  contenu: 'Contenu de test',
  image: 'https://example.com/image.jpg',
};

let mongoServer: MongoMemoryServer;

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

describe('📚 Intégration Articles', () => {
  it('devrait ajouter un article avec succès', async () => {
    const res = await request(app).post('/api/articles').send(mockArticle);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('articleId');
  });

  it('devrait récupérer les articles', async () => {
    await request(app).post('/api/articles').send(mockArticle);
    const res = await request(app).get('/api/articles');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });
});
