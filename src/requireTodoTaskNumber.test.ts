/* eslint-disable max-lines */
import { RuleTester } from "eslint";

import type { Rule } from "eslint";

import rule from "./requireTodoTaskNumber.js";

const dummyRule: Rule.RuleModule = {
    create(context) {
        return {
            Program(node) { /* empty */ },
        };
    },
};

const tester = new RuleTester({
    // fake plugin, so we can simulate any other rule with "to do" in name
    plugins: {
        xxx: {
            rules: {
                todo: dummyRule,
            },
        },
    },
});

tester.run("Task number is always required", rule, {
    valid: [
        "// TODO Implement feature AB-123",
        "// FIXME Implement feature AB-123",
        "// @fixme Implement feature AB-123",
        `/**
         @fixme Implement feature AB-123
         */`,

    ],
    invalid: [
        {
            code: "// TODO",
            errors: [{ messageId: "missingTaskNumber" }],
        },
        {
            code: "// FIXME",
            errors: [{ messageId: "missingTaskNumber" }],
        },
        {
            code: "// @fixme",
            errors: [{ messageId: "missingTaskNumber" }],
        },
        {
            code: `/**
            @fixme
            */`,
            errors: [{ messageId: "missingTaskNumber" }],
        },
        {
            code: "// TODO just some description",
            errors: [{ messageId: "missingTaskNumber" }],
        },
        {
            code: "// FIXME just some description",
            errors: [{ messageId: "missingTaskNumber" }],
        },
        {
            code: "// @fixme just some description",
            errors: [{ messageId: "missingTaskNumber" }],
        },
        {
            code: `/**
            @fixme just some description
            */`,
            errors: [{ messageId: "missingTaskNumber" }],
        },
    ],
});

tester.run("todo in the name of disabled rule does not interfere", rule, {
    valid: [
        // We have to ignore disable directives including "to do" in their names
        "// eslint-disable-next-line xxx/todo",
        "// eslint-disable-next-line max-lines,xxx/todo",
        "// eslint-disable-line xxx/todo",

        // Extra content before directive is accepted and won't break the logic
        "// hi, eslint-disable-line xxx/todo",

        // to do comment after directive is technically accepted by the rule,
        // because eslint will ask to remove it anyway (will be reported as invalid rule)
        // and because of that report, we can't really test it here
        // "// eslint-disable-line xxx/todo TODO",
        // "// eslint-disable-next-line xxx/todo TODO",

        // Any comment in multiline comment before `eslint-disable` makes the directive just a standard comment, so here it would be tested, but it's valid because it has a task number
        "/* TODO Implement feature AB-123 eslint-disable xxx/todo */",

        // Any comment in single line comment before `eslint-disable*-line` should be tested, here it's valid because it has a task number
        "// TODO Implement feature AB-123 eslint-disable-next-line max-lines,xxx/todo",
        "// TODO Implement feature AB-123 eslint-disable-line xxx/todo",
    ],
    invalid: [
        {
            // "to do" comment at the beginning is tested, but it's missing task number
            code: "// TODO eslint-disable-line xxx/todo",
            errors: [{ messageId: "missingTaskNumber" }],
        },
        {
            // "to do" comment at the beginning is tested, but it's missing task number
            code: "// TODO eslint-disable-next-line xxx/todo",
            errors: [{ messageId: "missingTaskNumber" }],
        },
        {
            // any comment at the beginning makes "eslint-disable" directive just a comment, so it's tested, and it's "to do" that's missing the task number
            code: "/* TODO eslint-disable xxx/todo */",
            errors: [{ messageId: "missingTaskNumber" }],
        },
    ],
});

tester.run("Task number must match the ID if given", rule, {
    valid: [
        {
            code: "// TODO Implement feature AB-123",
            options: [{
                projectId: "AB",
            }],
        },
        {
            code: "// FIXME Implement feature CD-123",
            options: [{
                projectId: "CD",
            }],
        },
        {
            code: "// @fixme Implement feature X-3",
            options: [{
                projectId: "X",
            }],
        },
        {
            code: `/**
            @fixme Implement feature ZZZZZ-123
            */`,
            options: [{
                projectId: "ZZZZZ",
            }],
        },
    ],
    invalid: [
        {
            code: "// TODO Implement feature CD-456",
            options: [{
                projectId: "AB",
            }],
            errors: [{ messageId: "missingTaskNumber" }],
        },
        {
            code: "// FIXME Implement feature Z-456",
            options: [{
                projectId: "AB",
            }],
            errors: [{ messageId: "missingTaskNumber" }],
        },
        {
            code: "// @fixme Implement feature W-456",
            options: [{
                projectId: "AB",
            }],
            errors: [{ messageId: "missingTaskNumber" }],
        },
        {
            code: `/**
            @fixme Implement feature U-456
            */`,
            options: [{
                projectId: "AB",
            }],
            errors: [{ messageId: "missingTaskNumber" }],
        },
    ],
});

tester.run("Task number must be first if specified", rule, {
    valid: [
        {
            code: "// TODO AB-123 Implement feature",
            options: [{
                projectIdFirst: true,
            }],
        },
        {
            code: "// FIXME CD-123 Implement feature",
            options: [{
                projectIdFirst: true,
            }],
        },
        {
            code: "// @fixme X-3 Implement feature",
            options: [{
                projectIdFirst: true,
            }],
        },
        {
            code: `/**
            @fixme ZZZZZ-123 Implement feature
            */`,
            options: [{
                projectIdFirst: true,
            }],
        },
    ],
    invalid: [
        {
            code: "// TODO Implement feature AB-123",
            options: [{
                projectIdFirst: true,
            }],
            errors: [{ messageId: "taskNumberNotFirst" }],
        },
        {
            code: "// FIXME Implement feature CD-123",
            options: [{
                projectIdFirst: true,
            }],
            errors: [{ messageId: "taskNumberNotFirst" }],
        },
        {
            code: "// @fixme Implement feature X-3",
            options: [{
                projectIdFirst: true,
            }],
            errors: [{ messageId: "taskNumberNotFirst" }],
        },
        {
            code: `/**
            @fixme Implement feature ZZZZZ-123
            */`,
            options: [{
                projectIdFirst: true,
            }],
            errors: [{ messageId: "taskNumberNotFirst" }],
        },
    ],
});

tester.run("Description is required (10 by default)", rule, {
    valid: [
        "// TODO AB-123 Implement feature",
        "// FIXME CD-123 Implement feature",
        "// @fixme X-3 Implement feature",
        `/**
        @fixme ZZZZZ-123 Implement feature
        */`,
        `/**
        @todo Can be ZZZZZ-123 around as well
        */`,
    ],
    invalid: [
        {
            code: "// TODO Too AB-123 short",
            errors: [{ messageId: "noDescription" }],
        },
        {
            code: "// FIXME CD-123 Too short",
            errors: [{ messageId: "noDescription" }],
        },
        {
            code: "// @fixme Too short X-3",
            errors: [{ messageId: "noDescription" }],
        },
    ],
});

tester.run("Description requirement can be adjusted", rule, {
    valid: [
        {
            code: "// TODO AB-123 All ok",
            options: [{
                minDescriptionLength: 5,
            }],
        },
        {
            code: "// FIXME CD-123 Implement feature",
            options: [{
                minDescriptionLength: 5,
            }],
        },
        {
            code: "// @fixme X-3 Implement feature",
            options: [{
                minDescriptionLength: 5,
            }],
        },
        {
            code: `/**
            @fixme Implement ZZZZZ-123 feature
            */`,
            options: [{
                minDescriptionLength: 5,
            }],
        },
        // Can be disabled:
        {
            code: `/**
            @fixme ABC-123
            */`,
            options: [{
                minDescriptionLength: 0,
            }],
        },
    ],
    invalid: [
        {
            code: "// TODO AB-123",
            options: [{
                minDescriptionLength: 5,
            }],
            errors: [{ messageId: "noDescription" }],
        },
        {
            code: "// FIXME Wil fix it here CD-123 or maybe not",
            options: [{
                minDescriptionLength: 100,
            }],
            errors: [{ messageId: "noDescription" }],
        },
        {
            code: "// @fixme X-3 Oops",
            options: [{
                minDescriptionLength: 5,
            }],
            errors: [{ messageId: "noDescription" }],
        },
        {
            code: `/**
            @fixme ZZZZZ-123 This is too short
            */`,
            options: [{
                minDescriptionLength: 100,
            }],
            errors: [{ messageId: "noDescription" }],
        },
    ],
});

tester.run("Extra white spaces does not count as description", rule, {
    valid: [
        "// TODO AB-123 0123456789",
        "// FIXME CD-123 0123456789",
        "// @fixme X-3 0123456789",
        `/**
        @fixme ZZZZZ-123 0123456789
        */`,
    ],
    invalid: [
        {
            code: "// TODO              AB-123 x",
            errors: [{ messageId: "noDescription" }],
        },
        {
            code: "// FIXME CD-123 xx       x",
            errors: [{ messageId: "noDescription" }],
        },
        {
            code: "// @fixme X-3 xx     x           x ",
            errors: [{ messageId: "noDescription" }],
        },
        {
            code: `/**
            @fixme x              x ZZZZZ-123                     x                 x
            */`,
            errors: [{ messageId: "noDescription" }],
        },
    ],
});

tester.run("TODO only caught in a comment", rule, {
    valid: [
        "console.log('I can do TODO here');",
        "console.log('I can do FIXME here');",
        "console.log('I can do @fixme here');",
        "alert('I can do todo here');",
    ],
    invalid: [],
});

tester.run("TODO must be first in the comment", rule, {
    valid: [
        "// TODO AB-123 Implement feature",
        "// FIXME CD-123 Implement feature",
        "// @fixme X-3 Implement feature",
        `/**
        I can comment in other lines
        @fixme ZZZZZ-123 Implement feature
        */`,
    ],
    invalid: [
        {
            code: "// This is a comment, and then TODO AB-123 Implement feature",
            errors: [{ messageId: "notStartingWithTodo" }],
        },
        {
            code: "// whatever FIXME is here, but not at the beginning CD-123 Implement feature",
            errors: [{ messageId: "notStartingWithTodo" }],
        },
        {
            code: "// Some text and then @fixme X-3 Implement feature",
            errors: [{ messageId: "notStartingWithTodo" }],
        },
        {
            code: `/**
            Some text before
            but not here @fixme ZZZZZ-123 Implement feature
            */`,
            errors: [{ messageId: "notStartingWithTodo" }],
        },
        {
            code: "/* hi eslint-disable xxx/todo TODO Implement feature AB-123 */",
            errors: [{ messageId: "notStartingWithTodo" }],
        },

        // "not starting with to do" is tested before "missing task number"
        {
            code: "/* hi eslint-disable xxx/todo TODO */",
            errors: [{ messageId: "notStartingWithTodo" }],
        },
    ],
});
