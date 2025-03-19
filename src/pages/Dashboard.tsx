import React, { useEffect, useState } from "react";
import lessonService from "../services/lessonService.ts"; // Zorg ervoor dat je lessonService hebt
import { Lesson } from "../services/lessonService.ts"; // Zorg ervoor dat je Lesson interface hebt

const Dashboard: React.FC = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]); // Hier worden de lessen opgeslagen

  // Laad de lessen bij het initialiseren van de component
  useEffect(() => {
    const fetchLessons = async () => {
      const data = await lessonService.readAll(); // Ophalen van lessen via lessonService
      setLessons(data); // Sla de opgehaalde lessen op in de state
    };
    fetchLessons();
  }, []); // Laad de lessen één keer bij het laden van de component

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Lessen</h2>

      {/* Lijst van lessen */}
      <div className="table-responsive">
        {lessons.length > 0 ? (
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Vak</th>
                <th>Datum</th>
                <th>Klas</th>
              </tr>
            </thead>
            <tbody>
              {lessons.map((lesson) => (
                <tr key={lesson.id}>
                  <td>{lesson.subject}</td>
                  <td>{lesson.date}</td>
                  <td>{lesson.classId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Er zijn geen lessen beschikbaar.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
