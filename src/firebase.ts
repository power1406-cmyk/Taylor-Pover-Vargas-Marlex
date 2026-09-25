import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  // Configuración inyectada automáticamente por AI Studio
  projectId: 'canvas-fastness-kxjsq',
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
