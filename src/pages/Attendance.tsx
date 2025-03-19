import React, { useEffect, useState } from "react";
import lessonService from "../services/lessonService.ts";
import studentService from "../services/studentService.ts"; // Zorg ervoor dat je studentService hebt
import { Lesson } from "../services/lessonService.ts";
import { Student } from "../services/studentService.ts"; // Zorg ervoor dat je Student interface hebt
import { Presence } from "../services/lessonService.ts"; // Zorg ervoor dat je Presence interface hebt
import "bootstrap/dist/css/bootstrap.min.css";

const Attendance: React.FC = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [students, setStudents] = useState<Student[]>([]); // Studentenlijst
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [presenceList, setPresenceList] = useState<Presence[]>([]); // Aanwezigheid per student
  const [presence, setPresence] = useState<Record<string, boolean>>({}); // Aanwezigheidsstate per student

  // Laad alle lessen bij het initialiseren van de component
  useEffect(() => {
    const fetchLessons = async () => {
      const data = await lessonService.readAll();
      setLessons(data);
    };
    fetchLessons();
  }, []);

  // Laad studenten voor een geselecteerde les op basis van classId
  const fetchStudentsForLesson = async (classId: string) => {
    const studentsData = await studentService.readAll();
    const filteredStudents = studentsData.filter(
      (student) => student.classId === classId
    );
    setStudents(filteredStudents);
  };

  // Haal aanwezigheid op voor de geselecteerde les
  const fetchAttendanceForLesson = async (lessonId: string) => {
    const attendanceData = await lessonService.getPresence(lessonId);
    setPresenceList(attendanceData);

    // Maak de aanwezigheid state op basis van de opgehaalde data
    const presenceState: Record<string, boolean> = {};
    attendanceData.forEach((entry) => {
      presenceState[entry.id] = entry.present;
    });
    setPresence(presenceState);
  };

  // Verandert de geselecteerde les en haalt de studenten en aanwezigheid op
  const handleLessonChange = (lessonId: string) => {
    const selected = lessons.find((lesson) => lesson.id === lessonId);
    if (selected) {
      setSelectedLesson(selected);
      fetchStudentsForLesson(selected.classId);
      fetchAttendanceForLesson(lessonId);
    } else {
      setPresenceList([]);
      setPresence({});
      setStudents([]);
    }
  };

  // Wijzigt de aanwezigheid van een student
  const handleAttendanceChange = (studentId: string) => {
    setPresence((prevState) => ({
      ...prevState,
      [studentId]: !prevState[studentId], // Toggle de aanwezigheid
    }));
  };

  // Sla de aanwezigheid op in Firestore
  const saveAttendance = async () => {
    if (!selectedLesson) return;

    // Voor elke student, sla de aanwezigheid op
    for (const studentId in presence) {
      const present = presence[studentId];
      const student = students.find((s) => s.id === studentId);

      if (student) {
        await lessonService.markPresence(
          selectedLesson.id,
          studentId,
          student.name,
          present
        );
      }
    }

    alert("Aanwezigheid succesvol opgeslagen!");
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Aanwezigheid per les</h2>

      {/* Les selecteren */}
      <div className="mb-3">
        <label className="form-label">Kies een les:</label>
        <select className="form-select" onChange={(e) => handleLessonChange(e.target.value)}>
          <option value="">Selecteer een les...</option>
          {lessons.map((lesson) => (
            <option key={lesson.id} value={lesson.id}>
              {lesson.subject} - {lesson.date}
            </option>
          ))}
        </select>
      </div>

      {/* Lijst van studenten voor de geselecteerde les */}
      {selectedLesson && (
        <div className="card p-3">
          <h4>Les: {selectedLesson.subject} - {selectedLesson.date}</h4>

          <h5>Studenten in deze les:</h5>
          {students.length > 0 ? (
            <ul className="list-group mb-3">
              {students.map((student) => (
                <li key={student.id} className="list-group-item">
                  {student.name}
                  <input
                    type="checkbox"
                    className="form-check-input ms-2"
                    checked={presence[student.id] || false}
                    onChange={() => handleAttendanceChange(student.id)}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <p>Geen studenten gevonden voor deze les.</p>
          )}

          {/* Aanwezigheid opslaan knop */}
          <button className="btn btn-primary mt-3" onClick={saveAttendance}>
            Aanwezigheid opslaan
          </button>
        </div>
      )}
    </div>
  );
};

export default Attendance;
