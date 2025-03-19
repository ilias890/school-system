import React from "react";
import CRUDComponent from "../components/CRUDComponent.tsx";
import { Student } from "../services/studentService.ts"; // Import the Student type
import studentService from "../services/studentService.ts"; // Import the student service
import classService from "../services/classService.ts"; // Import the class service

const Students = () => {
  // Explicitly define the fields for the student data model
  const fields: {
    key: keyof Omit<Student, "id">;
    label: string;
    type: string;
    optionsService?: {
      fetchOptions: () => Promise<{ id: string; name: string }[]>;
      idField: string;
      nameField: string;
    };
  }[] = [
    { key: "name", label: "Naam", type: "text" },
    { key: "email", label: "Email", type: "text" },
    { key: "createdAt", label: "Aangemaakt", type: "text" }, // Assuming it's a string, you may need to handle timestamp
    { key: "birth", label: "Geboortedatum", type: "date" },
    { key: "address", label: "Adres", type: "text" },
    { key: "gender", label: "Geslacht", type: "text" },
    { key: "phone", label: "Telefoon", type: "tel" },
    {
      key: "classId",
      label: "Klas",
      type: "dropdown",
      optionsService: {
        fetchOptions: classService.readAll,
        idField: "id",
        nameField: "name",
      },
    },
  ];

  const getId = (item: Student) => item.id;

  const emptyItem: Omit<Student, "id"> = {
    name: "",
    birth: "",
    classId: "",
    createdAt: "",
    email: "",
    address: "",
    gender: "",
    phone: "",
  };

  return (
    <CRUDComponent<Student>
      title="Studenten"
      fields={fields}
      service={studentService}
      getId={getId}
      emptyItem={emptyItem}
    />
  );
};

export default Students;
