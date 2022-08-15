import { firebaseConfig } from '$lib/firebaseConfig';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
