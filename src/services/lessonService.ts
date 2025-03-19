import { db } from "../config/firebase.ts";
import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import { Student } from "./studentService";

export interface Lesson {
  id: string;
  subject: string;
  date: string;
  classId: string;
}

export interface Presence {
  id: string;
  name: string;
  present: boolean;
  timestamp: string;
}

// Referentie naar de hoofdcollectie "lessons"
const lessonCollection = collection(db, "lessons");

const lessonService = {
  /** Haalt alle lessen op */
  readAll: async (): Promise<Lesson[]> => {
    const snapshot = await getDocs(lessonCollection);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Lesson));
  },

  /** Maakt een nieuwe les aan */
  create: async (data: Omit<Lesson, "id">): Promise<void> => {
    await addDoc(lessonCollection, data);
  },

  /** Werkt een bestaande les bij */
  update: async (id: string, data: Omit<Lesson, "id">): Promise<void> => {
    const docRef = doc(db, "lessons", id);
    await updateDoc(docRef, data);
  },

  /** Verwijdert een les */
  delete: async (id: string): Promise<void> => {
    const docRef = doc(db, "lessons", id);
    await deleteDoc(docRef);
  },

  /** Registreert de aanwezigheid van een student in de subcollectie "presence" */


  /** Haalt de aanwezigheid van alle studenten op voor een specifieke les */
  getPresence: async (lessonId: string): Promise<Presence[]> => {
    const presenceCollection = collection(db, `lessons/${lessonId}/presence`);
    const snapshot = await getDocs(presenceCollection);
    return snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Presence)
    );
  },

  getStudentsForLesson: async (lessonId: string): Promise<Student[]> => {
    const studentsCollection = collection(db, `lessons/${lessonId}/students`);
    const snapshot = await getDocs(studentsCollection);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Student));
  },

  getClassForLesson: async (lessonId: string): Promise<string> => {
    const lessonRef = doc(db, "lessons", lessonId);
    const lessonSnapshot = await getDoc(lessonRef);
    if (lessonSnapshot.exists()) {
      return lessonSnapshot.data().classId; // De classId van de les
    }
    throw new Error("Les niet gevonden");
  },

  /** Haalt de studenten op voor een specifieke klas */
  getStudentsForClass: async (classId: string): Promise<Student[]> => {
    const studentCollection = collection(db, "students");
    const snapshot = await getDocs(studentCollection);
    // Filter de studenten die bij de opgegeven classId horen
    return snapshot.docs
      .map((doc) => doc.data())
      .filter((student) => student.classId === classId) as Student[];
  },

  /** Registreer de aanwezigheid voor een student in een les */
  markPresence: async (
    lessonId: string,
    studentId: string,
    name: string,
    present: boolean
  ): Promise<void> => {
    const presenceRef = doc(db, `lessons/${lessonId}/presence`, studentId);
    await setDoc(presenceRef, {
      name,
      present,
      timestamp: new Date().toISOString(),
    });
  },
};

export default lessonService;
