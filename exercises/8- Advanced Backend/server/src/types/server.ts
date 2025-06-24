export interface User {
    id: string;
    username: string;
    password: string;
};

export interface Board {
    id: string;
    name: string;
    ownerId: string;
};

export interface Task {
    id: string;
    text: string;
    completed: boolean;
    boardId: string;
};

export interface BoardUser {
    userId: string;
    boardId: string;
    role: 'dueño' | 'editor' | 'lector';
}

