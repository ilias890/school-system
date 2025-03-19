import React from "react";
import CRUDComponent from "../components/CRUDComponent.tsx";
import { Teacher } from "../services/teacherService.ts";
import teacherService from "../services/teacherService.ts";

const Teachers = () => {
  const fields: { key: keyof Omit<Teacher, "id">; label: string; type: string }[] = [
    { key: "name", label: "Naam", type: "text" },
    { key: "email", label: "Email", type: "text" },
  ];

  const getId = (item: Teacher) => item.id;
  
  const emptyItem: Omit<Teacher, "id"> = { name: "", email: "" };

  return (
    <CRUDComponent<Teacher>
      title="Docenten"
      fields={fields}
      service={teacherService}
      getId={getId}
      emptyItem={emptyItem}
    />
  );
};

export default Teachers;
