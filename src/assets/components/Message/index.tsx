import styles from "./index.module.css";

interface MessageProps {
  id?: string;
  message?: string;
  username?: string;
  timestamp: number;
  onEdit: (id: string, message: string) => void;
  onDelete: (id: string) => void;
}

export default function Message({
  id = "0",
  message = "",
  username = "",
  timestamp,
  onEdit,
  onDelete,
}: MessageProps) {
  const time = new Date(timestamp * 1000);
  const hours = time.getHours();
  const minutes = time.getMinutes();

  return (
    <div className={styles.message}>
      <div className={styles["not-time"]}>
        <span className={styles["username-msg"]}>{username}:</span>
        <span>{message}</span>
        <span className={styles.action}>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onEdit(id, message);
            }}
          >
            edit
          </a>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onDelete(id);
            }}
          >
            delete
          </a>
        </span>
      </div>
      <span className={styles.time}>{time.toString()}</span>
      <span className={styles.time}>
        {hours}:{minutes.toString().padStart(2, "0")}
      </span>
    </div>
  );
}
