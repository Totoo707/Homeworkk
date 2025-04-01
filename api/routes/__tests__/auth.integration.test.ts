// ✅ Fichier : routes/__tests__/auth.integration.test.ts
import request from 'supertest';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { MongoMemoryServer } from 'mongodb-memory-server';
// @ts-ignore
import app from '../../server.js';

let mongoServer: MongoMemoryServer;

const mockUser = {
  email: 'test@example.com',
  motDePasse: '123456',
  nom: 'Jean Test'
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

describe('🔐 Authentification - /api/auth', () => {
  beforeEach(async () => {
    // On insère un utilisateur avec un mot de passe hashé
    const hashedPassword = await bcrypt.hash(mockUser.motDePasse, 10);
    await mongoose.connection.collection('utilisateurs').insertOne({
      email: mockUser.email,
      motDePasse: hashedPassword,
      nom: mockUser.nom
    });
  });

  it('devrait se connecter avec les bonnes infos', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: mockUser.email,
      motDePasse: mockUser.motDePasse
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toMatchObject({
      email: mockUser.email,
      nom: mockUser.nom
    });
  });

  it("devrait échouer si l'utilisateur n'existe pas", async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'inconnu@example.com',
      motDePasse: 'whatever'
    });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Utilisateur non trouvé.');
  });

  it('devrait échouer si le mot de passe est incorrect', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: mockUser.email,
      motDePasse: 'mauvaismotdepasse'
    });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Mot de passe incorrect.');
  });
});
