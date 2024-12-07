import React from 'react'

interface User {
    id: number;
    name: string;
    username: string;
    email: string;
}

const UsersPage = async () => {
    const res = await fetch('https://jsonplaceholder.typicode.com/users',
    { next: { revalidate: 60 } }); // revalidate every 60 seconds
    const users: User[] = await res.json();
    
  return (
    <div>
        <h1>Users</h1>
        <p>{new Date().toLocaleTimeString()}</p>
        <ul>
            {users.map(user => <li key={user.id}>{user.name}, {user.email}</li>)}
        </ul>
        
    </div>
  )
}

export default UsersPage