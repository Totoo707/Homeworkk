// start.ts
import mongoose from 'mongoose';
import app from './server.js';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/maBaseDeDonnées';
mongoose.connect(MONGODB_URI)
    .then(() => {
    console.log('✅ Connecté à MongoDB');
    app.listen(4000, () => {
        console.log('🚀 Serveur lancé sur http://localhost:4000');
    });
})
    .catch((err) => {
    console.error('❌ Erreur MongoDB :', err);
});
