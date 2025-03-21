import { db } from "../config/firebase.ts"; // Import your Firebase initialization
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

// Define the structure of the Student document
export interface Student {
  id: string;
  name: string;
  birth: string;
  classId: string;
  createdAt: string;
  email: string;
  address: string;
  gender: string;
  phone: string;
}

const studentCollection = collection(db, "students");

const studentService = {
  // Read all students
  readAll: async (): Promise<Student[]> => {
    const snapshot = await getDocs(studentCollection);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Student));
  },

  // Read students by classId
  readAllByClass: async (classId: string): Promise<Student[]> => {
    const q = query(studentCollection, where("classId", "==", classId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Student));
  },

  // Create a new student (ID is omitted because it will be generated by Firestore)
  create: async (data: Omit<Student, "id">): Promise<void> => {
    await addDoc(studentCollection, data);
  },

  // Update a student by its ID (Omitting 'id' from the update data)
  update: async (id: string, data: Omit<Student, "id">): Promise<void> => {
    const docRef = doc(db, "students", id);
    await updateDoc(docRef, data); // Update fields except for 'id'
  },

  // Delete a student by its ID
  delete: async (id: string): Promise<void> => {
    const docRef = doc(db, "students", id);
    await deleteDoc(docRef);
  },
};

export default studentService;
