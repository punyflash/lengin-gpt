import Dexie, { type DexieOptions, type Table } from "dexie";

export interface Chat {
    id?: number;
    name: string;
    createdAt?: number;
}

export interface Message {
    id?: number;
    chatId: number;
    role: string;
    content: string;
    createdAt?: number;
}

export class Database extends Dexie {
    chats!: Table<Chat, number>;
    messages!: Table<Message, number>;

    constructor(databaseName: string, options?: DexieOptions) {
        super(databaseName, options);

        this.version(1).stores({
            chats: "++id, name, createdAt",
            messages: "++id, chatId, role, content, createdAt",
        });
    }
}

export default new Database(import.meta.env.VITE_APP_NAME);
