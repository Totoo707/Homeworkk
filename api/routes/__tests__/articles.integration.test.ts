import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import path from 'path';
import fs from 'fs';
import FormData from 'form-data';
import app from '../../server.js';

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
  it('devrait ajouter un article avec image via multipart/form-data', async () => {
    const imagePath = path.join(__dirname, 'test-image.jpg');
    fs.writeFileSync(imagePath, 'fake image content');

    const res = await request(app)
      .post('/api/articles')
      .field('titre', 'Titre Test')
      .field('auteur', 'Auteur Test')
      .field('contenu', 'Contenu Test')
      .attach('image', imagePath);

    fs.unlinkSync(imagePath);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('articleId');
  });

  it('devrait retourner une erreur si un champ est manquant', async () => {
    const res = await request(app)
      .post('/api/articles')
      .field('titre', 'Titre sans auteur')
      .field('contenu', 'Contenu sans auteur');

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'Données invalides.');
  });

  it('devrait récupérer tous les articles', async () => {
    const imagePath = path.join(__dirname, 'test-image.jpg');
    fs.writeFileSync(imagePath, 'fake image content');

    await request(app)
      .post('/api/articles')
      .field('titre', 'Titre Fetch')
      .field('auteur', 'Auteur Fetch')
      .field('contenu', 'Contenu Fetch')
      .attach('image', imagePath);

    fs.unlinkSync(imagePath);

    const res = await request(app).get('/api/articles');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });
});

export {};
