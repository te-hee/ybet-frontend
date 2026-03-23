import styles from "./index.module.css";

interface ActiveUsersProps {
  users: string[];
}

export default function ActiveUsers({ users = [] }: ActiveUsersProps) {
  return (
    <div className={styles.users}>
      <h1>YbEt</h1>
      <div>
        {users.map((user, index) => (
          <span key={index}>{user}</span>
        ))}
      </div>
    </div>
  );
}
