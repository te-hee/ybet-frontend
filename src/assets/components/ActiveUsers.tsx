import '../styles/activeUsers.scss'

interface ActiveUsersProps {
    users: string[];
}

export default function ActiveUsers({ users = [] }: ActiveUsersProps) {
    return (
        <div className="users">
            <h1>YbEt</h1>
            <div>
                {users.map((user, index) => (
                    <span key={index}>{user}</span>
                ))}
            </div>
        </div>
    );
}