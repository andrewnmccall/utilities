"use strict";

const RuleTester = require("../../eslint-compat").RuleTester;
const rule = require("../../../lib/rules/tag-attribute-requirements");

const tester = new RuleTester({
    languageOptions: {
        parser: require("eslint-plugin-lodash-template/lib/parser/micro-template-eslint-parser"),
        ecmaVersion: 2015,
    },
});

tester.run("tag-attribute-requirements", rule, {
    valid: [
        {
            filename: "test.html",
            code: "",
        },
        {
            filename: "test.html",
            code: '<body><div><div data-id="foo" aria-test="bar" my-prop="prop"></div></div></body>',
        },
        {
            filename: "test.html",
            code: '<body><div data-id="foo" aria-test="bar"><a onclick="" my-prop="prop"></a></div></body>',
        },
        {
            filename: "test.html",
            code: "<body><div><div data-id aria-test my-prop></div></div></body>",
        },
        {
            filename: "test.html",
            code: '<body><div onClick="onClick"></div></body>',
            options: [{ ignore: ["onClick"] }],
        },
        {
            filename: "test.html",
            code: '<svg xml:space="preserve"></svg>',
        },
        {
            filename: "test-viewbox.html",
            code: '<svg viewBox="0 0 100 100"></svg>',
        },
    ],

    invalid: [
        {
            filename: "test.html",
            code: '<body><div><div MyProp="Bar"></div></div></body>',
            output: null,
            errors: [
                {
                    message: "Attribute `MyProp` must be 'kebab-case'.",
                    type: "HTMLIdentifier",
                    line: 1,
                },
            ],
        },
        {
            filename: "test.html",
            code: '<body><div><div myProp="Bar"></div></div></body>',
            output: null,
            errors: [
                {
                    message: "Attribute `myProp` must be 'kebab-case'.",
                    type: "HTMLIdentifier",
                    line: 1,
                },
            ],
        },
        {
            filename: "test.html",
            code: '<body><div><div my_prop="Bar"></div></div></body>',
            output: null,
            errors: [
                {
                    message: "Attribute `my_prop` must be 'kebab-case'.",
                    type: "HTMLIdentifier",
                    line: 1,
                },
            ],
        },
        {
            filename: "test.html",
            code: '<body><div><div MY-PROP="prop"></div></div></body>',
            output: '<body><div><div my-prop="prop"></div></div></body>',
            errors: [
                {
                    message: "Attribute `MY-PROP` must be 'kebab-case'.",
                    type: "HTMLIdentifier",
                    line: 1,
                },
            ],
        },
        {
            filename: "test.html",
            code: "<body><div><div MY-PROP<%='-JS'%>=\"prop\"></div></div></body>",
            output: null,
            errors: [
                {
                    message: "Attribute `MY-PROP` must be 'kebab-case'.",
                    type: "HTMLIdentifier",
                    line: 1,
                },
            ],
        },
        {
            filename: "test.html",
            code: "<body><div><div DATA-ID ARIA-TEST MY-PROP></div></div></body>",
            output: "<body><div><div data-id aria-test my-prop></div></div></body>",
            errors: [
                "Attribute `DATA-ID` must be 'kebab-case'.",
                "Attribute `ARIA-TEST` must be 'kebab-case'.",
                "Attribute `MY-PROP` must be 'kebab-case'.",
            ],
        },
        {
            filename: "test-svgcamel.html",
            code: '<svg viewBox="0 0 100 100"></svg>',
            output: null,
            options: [{ ignoreSvgCamelCaseAttributes: false }],
            errors: ["Attribute `viewBox` must be 'kebab-case'."],
        },
    ],
});