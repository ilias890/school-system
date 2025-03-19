import React from "react";
import CRUDComponent from "../components/CRUDComponent.tsx";
import { Lesson } from "../services/lessonService.ts";
import lessonService from "../services/lessonService.ts";
import classService from "../services/classService.ts";

const Lessons = () => {
  const fields: { 
    key: keyof Omit<Lesson, "id">; 
    label: string; 
    type: string;
    optionsService?: {
      fetchOptions: () => Promise<{ id: string; name: string }[]>;
      idField: string;
      nameField: string;
    };
  }[] = [
    { key: "subject", label: "Les", type: "text" },
    { key: "date", label: "Datum", type: "text" },
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

  const getId = (item: Lesson) => item.id;
  
  const emptyItem: Omit<Lesson, "id"> = {
      subject: "", classId: "",
      date: ""
  };

  return (
    <CRUDComponent<Lesson>
      title="Lessen"
      fields={fields}
      service={lessonService}
      getId={getId}
      emptyItem={emptyItem}
    />
  );
};

export default Lessons;
