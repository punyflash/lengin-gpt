import Dexie, {
    liveQuery,
    type DexieOptions,
    type IndexableType,
    type Table,
} from "dexie";

export interface Chat {
    id?: number;
    name: string;
    createdAt?: number;
}

export interface Message {
    id?: number;
    chatId?: number;
    role: string;
    content: string;
    createdAt?: number;
}

type Query<T = any, TKey = IndexableType> = (
    query: Table<T, TKey>,
) => Promise<T[]> | T[];

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

    async createChat(message: Message) {
        const createdAt = Date.now();
        const chatId = await this.chats.add({
            name: message.content,
            createdAt,
        });

        const messageId = await this.createMessage({ ...message, chatId });

        return { chatId, messageId };
    }

    async createMessage(message: Message) {
        const createdAt = Date.now();
        return await this.messages.add({
            ...message,
            createdAt,
        });
    }

    async getChat(chatId: number) {
        return await this.chats.get(chatId);
    }

    getChats(query?: Query<Chat, number> | undefined) {
        return liveQuery(() =>
            query ? query(this.chats) : this.chats.toArray(),
        );
    }
    getMessages(query?: Query<Message, number> | undefined) {
        return liveQuery(() =>
            query ? query(this.messages) : this.messages.toArray(),
        );
    }

    async deleteMessage(messageId: number) {
        if (!messageId) return;
        await this.messages.delete(messageId);
    }

    async deleteChat(chatId?: number) {
        if (!chatId) return;
        await this.chats.delete(chatId);
        await this.messages.where("chatId").equals(chatId).delete();
    }
}

export default new Database(import.meta.env.VITE_APP_NAME);
