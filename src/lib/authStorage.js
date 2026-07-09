const USERS_KEY = "blog_users";
const CURRENT_USER_KEY = "blog_current_user";

const defaultUsers = [
  {
    id: 1,
    name: "Thompson P.",
    username: "thompson",
    email: "thompson@example.com",
    password: "password123",
  },
];

export function getUsers() {
  const stored = localStorage.getItem(USERS_KEY);

  if (!stored) {
    localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
    return defaultUsers;
  }

  return JSON.parse(stored);
}

export function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function registerUser(user) {
  const users = getUsers();
  const newUser = { ...user, id: Date.now() };
  users.push(newUser);
  saveUsers(users);
  return newUser;
}

export function findUserByEmail(email) {
  return getUsers().find(
    (user) => user.email.toLowerCase() === email.toLowerCase()
  );
}

export function findUserByUsername(username) {
  return getUsers().find(
    (user) => user.username.toLowerCase() === username.toLowerCase()
  );
}

export function loginUser(email, password) {
  const user = findUserByEmail(email);

  if (!user || user.password !== password) {
    return null;
  }

  const { password: _password, ...safeUser } = user;
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(safeUser));
  return safeUser;
}

export function getCurrentUser() {
  const stored = localStorage.getItem(CURRENT_USER_KEY);
  return stored ? JSON.parse(stored) : null;
}

export function logoutUser() {
  localStorage.removeItem(CURRENT_USER_KEY);
}

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
