import requireTodoTaskNumber from "./requireTodoTaskNumber.js";

const plugin = {
    meta: {
        name: "@ezez/eslint-plugin-todo-task-id",
        version: "0.1.0",
    },
    rules: {
        "require-todo-task-number": requireTodoTaskNumber,
    },
};

// eslint-disable-next-line import/no-default-export
export default plugin;
