import React from "react";
import CRUDComponent from "../components/CRUDComponent.tsx";
import { Class } from "../services/classService.ts";
import classService from "../services/classService.ts";
import teacherService from "../services/teacherService.ts";

const Classes = () => {
  const fields: {
    key: keyof Omit<Class, "id">;
    label: string;
    type: string;
    optionsService?: {
      fetchOptions: () => Promise<{ id: string; name: string }[]>;
      idField: string;
      nameField: string;
    };
  }[] = [
    { key: "name", label: "Klas", type: "text" },
    {
      key: "teacherId",
      label: "Docent",
      type: "dropdown",
      optionsService: {
        fetchOptions: teacherService.readAll,
        idField: "id",
        nameField: "name",
      },
    },
    { key: "createdAt", label: "Aangemaakt op", type: "text" },
  ];

  const getId = (item: Class) => item.id;

  const emptyItem: Omit<Class, "id"> = { name: "", students: [], teacherId: "", createdAt: "" };

  return (
    <CRUDComponent<Class>
      title="Klassen"
      fields={fields}
      service={classService}
      getId={getId}
      emptyItem={emptyItem}
    />
  );
};

export default Classes;
