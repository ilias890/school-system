import { db } from "../config/firebase.ts";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

export interface Teacher {
  id: string;
  name: string;
  email: string;
}

const teacherCollection = collection(db, "teachers");

const teacherService = {
  readAll: async (): Promise<Teacher[]> => {
    const snapshot = await getDocs(teacherCollection);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Teacher));
  },

  create: async (data: Omit<Teacher, "id">): Promise<void> => {
    await addDoc(teacherCollection, data);
  },

  update: async (id: string, data: Omit<Teacher, "id">): Promise<void> => {
    const docRef = doc(db, "teachers", id);
    await updateDoc(docRef, data);
  },

  delete: async (id: string): Promise<void> => {
    const docRef = doc(db, "teachers", id);
    await deleteDoc(docRef);
  },
};

export default teacherService;
