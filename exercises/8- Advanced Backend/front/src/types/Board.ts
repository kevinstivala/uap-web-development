export type Board = {
  id: string;
  name: string;
  ownerId: string;
  role: "dueño" | "editor" | "lector"; // tu rol en ese board
  sharedUsers?: Array<{
    userId: string;
    username: string;
    role: "dueño" | "editor" | "lector";
  }>;
};