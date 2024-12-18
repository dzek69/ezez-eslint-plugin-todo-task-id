import type { Rule } from "eslint";

// eslint-disable-next-line no-warning-comments
/**
 * An ESLint rule to enforce a specific syntax for TODO and FIXME comments.
 */
const rule: Rule.RuleModule = { // eslint-disable-line object-shorthand
    meta: {
        type: "problem",
        docs: {
            description: "Enforces syntax for TODO and FIXME comments",
            category: "Best Practices",
            recommended: true,
        },
        messages: {
            notStartingWithTodo: "Line with a TODO comment must start with a TODO",
            missingTaskNumber: "TODO comment must include a task ID",
            taskNumberNotFirst: "Project ID must be the first part of the TODO comment",
            noDescription: "TODO comment must include a text description (min {chars} characters)",
        },
        schema: [
            {
                type: "object",
                additionalProperties: false,
                properties: {
                    projectId: {
                        type: "string",
                        pattern: "^[A-Z0-9]{1,10}$",
                    },
                    projectIdFirst: {
                        type: "boolean",
                        default: false,
                    },
                    minDescriptionLength: {
                        type: "integer",
                        default: 10,
                    },
                },
            },
        ],
    },

    // eslint-disable-next-line max-lines-per-function
    create(context) {
        // Regex to match TODO or FIX ME comments
        // Regex to validate the required syntax

        return {
            // eslint-disable-next-line max-lines-per-function
            Program(node) {
                const comments = context.sourceCode.getAllComments();
                const options = (context.options[0] as {
                    projectId: string;
                    projectIdFirst: boolean;
                    minDescriptionLength: number;
                } | undefined) ?? {
                    projectIdFirst: false,
                    minDescriptionLength: 10,
                };

                // eslint-disable-next-line max-lines-per-function
                comments.forEach((comment) => {
                    const lines = comment.value.split("\n");
                    let nodeReported = false;
                    // eslint-disable-next-line max-statements,max-lines-per-function
                    lines.forEach(_originalLine => {
                        let line = _originalLine.trim().replace(/\s+/ug, " ");
                        if (nodeReported) {
                            return;
                        }
                        if (!(/(todo|fixme)/iu.exec(line))) {
                            // not a to-do line
                            return;
                        }

                        // must start with to-do:
                        if (!(/^@?(todo|fixme)/iu.exec(line))) {
                            context.report({
                                node: comment as any, // eslint-disable-line
                                messageId: "notStartingWithTodo",
                            });
                            nodeReported = true;
                            return;
                        }

                        // cut off to-do part:
                        line = line.replace(/^@?(todo|fixme)\s*/iu, "");

                        // must have a project ID
                        const customProjectId = "projectId" in options ? options.projectId : null;
                        const projectIdRegexp = customProjectId
                            ? new RegExp("(" + customProjectId + "-\\d+)", "ui")
                            : /([A-Z]{1,10}-\d+)/ui;
                        if (!projectIdRegexp.exec(line)) {
                            context.report({
                                node: comment as any, // eslint-disable-line
                                messageId: "missingTaskNumber",
                            });
                            nodeReported = true;
                            return;
                        }

                        if (options.projectIdFirst) {
                            const idFirstRegexp = new RegExp("^" + projectIdRegexp.source, projectIdRegexp.flags);
                            if (!idFirstRegexp.exec(line)) {
                                context.report({
                                    node: comment as any, // eslint-disable-line
                                    messageId: "taskNumberNotFirst",
                                });
                                nodeReported = true;
                                return;
                            }
                        }

                        const projectRegExpWithSpace = new RegExp(
                            "\\s*" + projectIdRegexp.source + "\\s*", projectIdRegexp.flags,
                        );
                        line = line.replace(projectRegExpWithSpace, "").trim();

                        if (options.minDescriptionLength && line.length < options.minDescriptionLength) {
                            context.report({
                                node: comment as any, // eslint-disable-line
                                messageId: "noDescription",
                                data: {
                                    chars: String(options.minDescriptionLength),
                                },
                            });
                            nodeReported = true;
                        }
                    });
                });
            },

        };
    },
};

export default rule;
