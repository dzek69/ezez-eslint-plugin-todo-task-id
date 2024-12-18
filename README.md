This ESLint plugin enforces a standardized format for TODO and FIXME comments, ensuring that they are always accompanied by:

1. A descriptive comment that shortly explains what needs to be done.
1. A bug tracker task ID formatted as **[PREFIX-123]** to reference the corresponding issue.

## Why Use This Plugin?
Unstructured TODO or FIXME comments can lead to confusion ("what was this about?") and in result a "forever TODOs" in your codebase.
By enforcing a standardized format, you:

- Improve Traceability: Every comment links to a bug tracker task ID for easy follow-up.
- Enhance Clarity: Descriptive comments make tasks self-explanatory, without visiting the bug tracker.
- Maintain Quality: Avoid incomplete or vague TODO/FIXME entries.

## Available Rules
This plugin provides just a single rule:

- `require-todo-task-number`: Enforces a standardized format for TODO and FIXME comments.

To enable the rule, add it to your ESLint configuration file:

Old style config:
```json
{
  "plugins": ["@ezez/eslint-plugin-todo-task-id"],
  "rules": {
    "@ezez/todo-task-id/require-todo-task-number": "error"
  }
}
```

Flat style config:

```typescript
import todoTaskId from "@ezez/eslint-plugin-todo-task-id";

const config = [
    // other part of your config
    {
        name: "Todo Task ID plugin",
        plugins: {
            todoTaskId
        },
        rules: {
            "todoTaskId/require-todo-task-number": "error"
        }
    }
];

export default config;
```

### Configure `require-todo-task-number`

The rule accepts an optional object with the following properties:
- `projectId` (string): The bug tracker project ID to enforce in the format of 1 to 10 UPPER CASE a-z characters. When not given, the rule will accept any project ID.
- `projectIdFirst` (boolean): When `true`, the project ID must come immediately after the TODO/FIXME keyword. Default is `false`, which allows the project ID to appear anywhere in the comment (on the same line).
- `minDescriptionLength` (number): The minimum length of the description part of the comment. Default is `10`, however this check can be disabled by setting it to `0`.

