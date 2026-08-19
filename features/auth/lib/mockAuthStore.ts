import type { User } from "@/types";

// MOCK: in-memory + localStorage user store, standing in for a real user
// directory. Replace with Cognito-backed lookups in Phase 2.

const USERS_KEY = "marketplace:mock-users";
const SESSION_KEY = "marketplace:mock-session";

interface StoredUser extends User {
  password: string;
}

function isBrowser() {
  return typeof window !== "undefined";
}

function readUsers(): StoredUser[] {
  if (!isBrowser()) return [];
  const raw = window.localStorage.getItem(USERS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as StoredUser[];
  } catch {
    return [];
  }
}

function writeUsers(users: StoredUser[]) {
  if (!isBrowser()) return;
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getSessionUserId(): string | null {
  if (!isBrowser()) return null;
  return window.localStorage.getItem(SESSION_KEY);
}

function setSessionUserId(userId: string | null) {
  if (!isBrowser()) return;
  if (userId) {
    window.localStorage.setItem(SESSION_KEY, userId);
  } else {
    window.localStorage.removeItem(SESSION_KEY);
  }
}

function toPublicUser(user: StoredUser): User {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
    createdAt: user.createdAt,
  };
}

export function findUserById(id: string): User | null {
  const user = readUsers().find((u) => u.id === id);
  return user ? toPublicUser(user) : null;
}

export class AuthError extends Error {}

export function mockSignUp(
  name: string,
  email: string,
  password: string,
): User {
  const users = readUsers();
  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    throw new AuthError("An account with this email already exists.");
  }
  const newUser: StoredUser = {
    id: crypto.randomUUID(),
    name,
    email,
    password,
    createdAt: new Date().toISOString(),
  };
  writeUsers([...users, newUser]);
  setSessionUserId(newUser.id);
  return toPublicUser(newUser);
}

export function mockLogIn(email: string, password: string): User {
  const users = readUsers();
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user || user.password !== password) {
    throw new AuthError("Incorrect email or password.");
  }
  setSessionUserId(user.id);
  return toPublicUser(user);
}

export function mockLogOut(): void {
  setSessionUserId(null);
}
