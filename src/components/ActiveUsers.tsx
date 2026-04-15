import '../assets/styles/activeUsers.scss'

interface ActiveUsersProps {
    users: string[];
}

export default function ActiveUsers({ users = [] }: ActiveUsersProps) {
    return (
        <div className="users">
            <h1>Active Users</h1>
            <div className="user-list">
                {/* If the users array is empty, show a fallback message.
                  Otherwise, map through the users and display them.
                */}
                {users.length === 0 ? (
                    <span>No one else is here...</span>
                ) : (
                    users.map((user, index) => (
                        <span key={index} className="user-badge">
                            {user}
                        </span>
                    ))
                )}
            </div>
        </div>
    );
}