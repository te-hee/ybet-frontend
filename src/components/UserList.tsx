import { OnlineUser } from '../types';
import '../styles/users.css';

interface Props {
  users: OnlineUser[];
  selfUserId: string;
}

export function UserList({ users, selfUserId }: Props) {
  return (
    <aside className="users-sidebar">
      <div className="users-header">
        online
        <span className="users-count">{users.length}</span>
      </div>

      <div className="users-list">
        {users.length === 0 && (
          <div style={{ color: 'var(--text-faint)', fontSize: 11, padding: '8px', textAlign: 'center' }}>
            no one here yet :c
          </div>
        )}
        {users.map(u => (
          <div key={u.user_id} className="user-item">
            <div className="user-online-dot" />
            <span className={`user-name${u.user_id === selfUserId ? ' self' : ''}`}>
              {u.username}
            </span>
            {u.user_id === selfUserId && (
              <span className="user-self-tag">you</span>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}
