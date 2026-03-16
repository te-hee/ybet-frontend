import '../styles/messages.scss'

interface MessageProps {
    id?: string;
    message?: string;
    timestamp: number;
    onEdit: (id: string, message: string) => void;
    onDelete: (id: string) => void;
}

export default function Message({ id = "0", message = "", timestamp, onEdit, onDelete }: MessageProps) {
    const time = new Date(timestamp * 1000); // [cite: 11]
    const hours = time.getHours();
    const minutes = time.getMinutes();

    return (
        <div className="message">
            <div className="not-time">
                <span className="username-msg">{id}:</span>
                <span>{message}</span>
                <span className="actions">
                    <a href="#" onClick={(e) => { e.preventDefault(); onEdit(id, message); }}>edit</a>
                    <a href="#" onClick={(e) => { e.preventDefault(); onDelete(id); }}>delete</a>
                </span>
            </div>
            <span className="time">{time.toString()}</span>
            <span className="time">{hours}:{minutes.toString().padStart(2, "0")}</span>
        </div>
    );
}