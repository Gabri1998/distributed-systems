const fs = require("fs");

fs.readFile("access.log", "utf8", function (err, data) {
  const lines = data.split("\n");
  lines.pop();

  const loginRequests = getRequestsToday(lines, "/api/v1/users/login");
  const dentistLoginRequests = getRequestsToday(lines, "/api/v1/dentists/login");
   const slots = getRequestsToday(lines, "/api/v1/slots");
   const clinics = getRequestsToday(lines, "/api/v1/clinics");
   const dentists = getRequestsToday(lines, "/api/v1/dentists");
   const users = getRequestsToday(lines, "/api/v1/users");
   const notification = getRequestsToday(lines, "/api/v1/notification");
  const requestsToday = getRequestsToday(lines, "");

  console.log("Total requests today: ", requestsToday);
  console.log("Today logged in users: ", loginRequests);
  console.log("Today logged in dentists: ", dentistLoginRequests);
  console.log("Slot lookups today: ", slots);
  console.log("Clinics viewed today: ", clinics);
  console.log("Dentists interactions for today: ", dentists);
  console.log("Users interactions for today: ", users);
  console.log("Notification interactions for today: ", notification);
});

// ::1 - - [08/Jan/2024:20:00:17 +0000] "POST /api/v1/slots/659b0186eea6111b44bfb6be/book HTTP/1.1" 200 287 "-" "PostmanRuntime/7.36.0"
const getRequests = (logs, path) => {
  let counter = 0;
  logs.forEach((log) => {
    const currentPath = log.split('"')[1].split(" ")[1];
    if (currentPath.includes(path)) {
      counter++;
    }
  });
  return counter;
};
const getRequestsToday = (logs, path) => {
  let counter = 0;
  logs.forEach((line) => {
    const dateString = line
      .split("[")[1]
      .split("]")[0]
      .split(" ")[0]
      .split(":")[0];
    const date = new Date(dateString).toDateString();
    const today = new Date().toDateString();
    const currentPath = line.split('"')[1].split(" ")[1];
    if (currentPath.includes(path) && today === date) {
      counter++;
    }
  });
  return counter;
};
