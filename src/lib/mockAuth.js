const USERS_KEY = "blog_users";
const CURRENT_USER_KEY = "blog_current_user";

const defaultUsers = [
  {
    id: 1,
    name: "Intuch B.",
    username: "intuch",
    email: "intuch@example.com",
    password: "password123",
    profileImage: "",
  },
];

function toSafeUser(user) {
  const safeUser = { ...user };
  delete safeUser.password;
  return safeUser;
}

function setCurrentUser(user) {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(toSafeUser(user)));
  return toSafeUser(user);
}

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
  const newUser = { ...user, id: Date.now(), profileImage: user.profileImage ?? "" };
  users.push(newUser);
  saveUsers(users);
  return toSafeUser(newUser);
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

  return setCurrentUser(user);
}

export function getCurrentUser() {
  const stored = localStorage.getItem(CURRENT_USER_KEY);
  return stored ? JSON.parse(stored) : null;
}

export function logoutUser() {
  localStorage.removeItem(CURRENT_USER_KEY);
}

export function updateUserProfile(userId, updates) {
  const users = getUsers();
  const index = users.findIndex((user) => user.id === userId);

  if (index === -1) {
    return { ok: false, error: "User not found" };
  }

  const userWithSameEmail = updates.email && findUserByEmail(updates.email);
  if (userWithSameEmail && userWithSameEmail.id !== userId) {
    return { ok: false, error: "Email is already taken", field: "email" };
  }

  const userWithSameUsername =
    updates.username && findUserByUsername(updates.username);
  if (userWithSameUsername && userWithSameUsername.id !== userId) {
    return { ok: false, error: "Username is already taken", field: "username" };
  }

  users[index] = { ...users[index], ...updates };
  saveUsers(users);
  return { ok: true, user: setCurrentUser(users[index]) };
}

export function resetUserPassword(userId, currentPassword, newPassword) {
  const users = getUsers();
  const index = users.findIndex((user) => user.id === userId);

  if (index === -1) {
    return { ok: false, error: "User not found" };
  }

  if (users[index].password !== currentPassword) {
    return { ok: false, error: "Current password is incorrect", field: "currentPassword" };
  }

  users[index] = { ...users[index], password: newPassword };
  saveUsers(users);
  return { ok: true, user: setCurrentUser(users[index]) };
}

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
