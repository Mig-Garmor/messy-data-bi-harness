import { randomUUID } from "node:crypto";

export interface Run {
  id: string;
  createdAt: string;
}

export function createRun(): Run {
  return {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
  };
}
