"use client"

import React, { useEffect, useState } from "react";

// interface User {
//     id: number;
//     name: string;
//     username: string;
//     email: string;
// }

// const UsersPage = async () => {
//     const res = await fetch('https://jsonplaceholder.typicode.com/users',
//     { next: { revalidate: 60 } }); // revalidate every 60 seconds
//     const users: User[] = await res.json();

//   return (
//     <div>
//         <h1>Users</h1>
//         <p>{new Date().toLocaleTimeString()}</p>
//         <ul>
//             {users.map(user => <li key={user.id}>{user.name}, {user.email}</li>)}
//         </ul>

//     </div>
//   )
// }

// export default UsersPage



interface Student {
  id: string; 
  name: string;
  email: string;
  clubId: string;
}

interface Club {
  clubId: string;
  clubName: string;
}

interface UsersPageProps {
  clubId: string; 
}

const UsersPage: React.FC<UsersPageProps> = ({ clubId }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch students that belong to the club
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch(`/api/clubs/${clubId}/students`);
        const data = await res.json();
        setStudents(data);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [clubId]);

  // If the data is still loading, show a loading message
  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Students in Club</h1>
      <p>{new Date().toLocaleTimeString()}</p>

      {students.length === 0 ? (
        <p>No students found for this club.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>{student.name}</td>
                <td>{student.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UsersPage;
