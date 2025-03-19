import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "./firebase.ts";

class FirestoreCrudService<T extends Record<string, any>> {
  private collectionName: string;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
  }

  async create(data: T): Promise<void> {
    try {
      const collectionRef = collection(db, this.collectionName);
      await addDoc(collectionRef, data);
      console.log(`Document toegevoegd aan collectie "${this.collectionName}"`);
    } catch (error) {
      console.error(`Fout bij het toevoegen aan collectie "${this.collectionName}":`, error);
    }
  }

  async readAll(): Promise<(T & { id: string })[]> {
    try {
      const querySnapshot = await getDocs(collection(db, this.collectionName));
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as T & { id: string }));
    } catch (error) {
      console.error(`Fout bij ophalen van ${this.collectionName}:`, error);
      return [];
    }
  }

  async update(id: string, updatedData: Partial<T>): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await updateDoc(docRef, updatedData as Partial<Record<string, any>>);
      console.log(`Document bijgewerkt in collectie "${this.collectionName}"`);
    } catch (error) {
      console.error(`Fout bij bijwerken van ${this.collectionName}:`, error);
    }
  }
  

  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await deleteDoc(docRef);
      console.log(`Document verwijderd uit collectie "${this.collectionName}"`);
    } catch (error) {
      console.error(`Fout bij verwijderen van ${this.collectionName}:`, error);
    }
  }
}

export default FirestoreCrudService;
