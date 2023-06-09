export const FIND_MANY_TASKS_MOCK = [
  {
    id: 1,
    summary: "Take law office phone number",
    userId: 1,
    createdAt: "2023-04-06T02:39:52.272Z",
    user: {
      id: 1,
      username: "maria",
      password: "$2b$08$8dgXPq194xFkZs3TLNNkCOn/haQbtlKjEs30VpS2B2/6e8t2TJuPC",
      role: "manager",
      createdAt: "2023-04-06T02:38:41.215Z",
      updatedAt: null,
      deletedAt: null
    },
    updatedAt: null,
    deletedAt: null,
    status: "backlog"
  },
  {
    id: 2,
    summary: "Take law office phone number",
    userId: 1,
    createdAt: "2023-04-06T02:39:56.109Z",
    user: {
      id: 1,
      username: "maria",
      password: "$2b$08$8dgXPq194xFkZs3TLNNkCOn/haQbtlKjEs30VpS2B2/6e8t2TJuPC",
      role: "manager",
      createdAt: "2023-04-06T02:38:41.215Z",
      updatedAt: null,
      deletedAt: null
    },
    updatedAt: "2023-04-06T02:51:24.987Z",
    deletedAt: "2023-04-06T02:51:24.986Z",
    status: "backlog"
  },
  {
    id: 3,
    summary: "Take law office phone number",
    userId: 2,
    createdAt: "2023-04-06T02:43:19.126Z",
    user: {
      id: 2,
      username: "ernane",
      password: "$2b$08$1S2Ftag/3dpaddxXviEOBeHMpcrNIP5bswak58VIirh5KmaUcchjW",
      role: "manager",
      createdAt: "2023-04-06T02:42:40.380Z",
      updatedAt: null,
      deletedAt: null
    },
    updatedAt: null,
    deletedAt: null,
    status: "backlog"
  },
  {
    id: 4,
    summary: "Take law office phone number",
    userId: 2,
    createdAt: "2023-04-06T02:43:22.127Z",
    user: {
      id: 2,
      username: "ernane",
      password: "$2b$08$1S2Ftag/3dpaddxXviEOBeHMpcrNIP5bswak58VIirh5KmaUcchjW",
      role: "manager",
      createdAt: "2023-04-06T02:42:40.380Z",
      updatedAt: null,
      deletedAt: null
    },
    updatedAt: null,
    deletedAt: null,
    status: "backlog"
  },
  {
    id: 5,
    summary: "Take law office phone number",
    userId: 2,
    createdAt: "2023-04-06T02:43:22.721Z",
    user: {
      id: 2,
      username: "ernane",
      password: "$2b$08$1S2Ftag/3dpaddxXviEOBeHMpcrNIP5bswak58VIirh5KmaUcchjW",
      role: "manager",
      createdAt: "2023-04-06T02:42:40.380Z",
      updatedAt: null,
      deletedAt: null
    },
    updatedAt: null,
    deletedAt: null,
    status: "backlog"
  },
  {
    id: 6,
    summary: "Take law office phone number",
    userId: 2,
    createdAt: "2023-04-06T02:43:23.021Z",
    user: {
      id: 2,
      username: "ernane",
      password: "$2b$08$1S2Ftag/3dpaddxXviEOBeHMpcrNIP5bswak58VIirh5KmaUcchjW",
      role: "manager",
      createdAt: "2023-04-06T02:42:40.380Z",
      updatedAt: null,
      deletedAt: null
    },
    updatedAt: null,
    deletedAt: null,
    status: "backlog"
  },
  {
    id: 7,
    summary: "Take law office phone number",
    userId: 2,
    createdAt: "2023-04-06T02:43:23.198Z",
    user: {
      id: 2,
      username: "ernane",
      password: "$2b$08$1S2Ftag/3dpaddxXviEOBeHMpcrNIP5bswak58VIirh5KmaUcchjW",
      role: "manager",
      createdAt: "2023-04-06T02:42:40.380Z",
      updatedAt: null,
      deletedAt: null
    },
    updatedAt: null,
    deletedAt: null,
    status: "backlog"
  },
  {
    id: 8,
    summary: "Take law office phone number",
    userId: 2,
    createdAt: "2023-04-06T02:43:23.345Z",
    user: {
      id: 2,
      username: "ernane",
      password: "$2b$08$1S2Ftag/3dpaddxXviEOBeHMpcrNIP5bswak58VIirh5KmaUcchjW",
      role: "manager",
      createdAt: "2023-04-06T02:42:40.380Z",
      updatedAt: null,
      deletedAt: null
    },
    updatedAt: "2023-04-06T02:48:23.138Z",
    deletedAt: null,
    status: "to do"
  }
];

export function generateRandomNumber() {
  let randomNumber = Math.floor(Math.random() * 90000) + 10000;
  return randomNumber;
}

export const USER_MOCK = {
  id: 8,
  username: "dilma",
  password: "$2b$08$JH4hm.iV01fCrYWTVblAP.EG2MGRq02EUd7O92ZBlDaUGoTkgsGfi",
  role: "manager",
  createdAt: "2023-04-05T18:20:19.001Z",
  updatedAt: null,
  deletedAt: null
};

export const CREATE_TASK_MOCK = {
  title: "Task created",
  summary: "socorro mainhaaaa",
  userId: 7
};

export const CREATE_TASK_WITH_EMPTY_TITLE = {
  title: "",
  summary: "socorro mainhaaaa",
  userId: 7
};

export const UPDATE_TASK = {
  title: "Task created",
  summary: "socorro mainhaaaa",
  userId: 7,
  status: "backlog",
  taskId: 1
};

export const UPDATE_TASK_WITH_INVALID_STATUS = {
  title: "Task created",
  summary: "socorro mainhaaaa",
  userId: 7,
  status: "invalid",
  taskId: 1
};

export const TASK_MOCK = {
  id: 21,
  title: "Bem vindo",
  sumary: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  userId: 8,
  status: "backlog",
  createdAt: "2023-04-06T02:15:10.642Z",
  updatedAt: null,
  deletedAt: null
};

export const USER_WITH_INVALID_PASSWORD_REPEAT = {
  username: "dilma",
  password: "1234",
  repeatPassword: "4321",
  role: "manager"
};
