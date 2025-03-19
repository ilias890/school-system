import { db } from "../config/firebase.ts";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

export interface Class {
  id: string;
  name: string;
  students: string[];
  teacherId: string;
  createdAt: string;
}

const classCollection = collection(db, "classes");

const classService = {
  readAll: async (): Promise<Class[]> => {
    const snapshot = await getDocs(classCollection);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Class));
  },

  create: async (data: Omit<Class, "id">): Promise<void> => {
    await addDoc(classCollection, data);
  },

  update: async (id: string, data: Omit<Class, "id">): Promise<void> => {
    const docRef = doc(db, "classes", id);
    await updateDoc(docRef, data);
  },

  delete: async (id: string): Promise<void> => {
    const docRef = doc(db, "classes", id);
    await deleteDoc(docRef);
  },
};

export default classService;
