/* eslint-disable max-lines */
import { RuleTester } from "eslint";

import rule from "./requireTodoTaskNumber.js";

const tester = new RuleTester({});

// Task number is always required:
tester.run("todo-fixme-syntax", rule, {
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

// Task number must match the ID if given:
tester.run("todo-fixme-syntax", rule, {
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

// Task number must be first if specified:
tester.run("todo-fixme-syntax", rule, {
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

// Description is required (10 by default):
tester.run("todo-fixme-syntax", rule, {
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

// Description can be adjusted:
tester.run("todo-fixme-syntax", rule, {
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

// Extra white spaces won't help:
tester.run("todo-fixme-syntax", rule, {
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

// Do not match TODO not in the comment:
tester.run("todo-fixme-syntax", rule, {
    valid: [
        "console.log('I can do TODO here');",
        "console.log('I can do FIXME here');",
        "console.log('I can do @fixme here');",
        "alert('I can do todo here');",
    ],
    invalid: [],
});
