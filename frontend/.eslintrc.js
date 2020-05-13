module.exports = {
    "parser": "babel-eslint",
    'env': {
        'browser': true,
        'es6': true,
    },
    'extends': [
        'plugin:react/recommended'
    ],
    'globals': {
        'Atomics': 'readonly',
        'SharedArrayBuffer': 'readonly',
    },
    'parserOptions': {
        'ecmaFeatures': {
            'jsx': true,
        },
        'ecmaVersion': 2018,
        'sourceType': 'module',
    },
    'plugins': [
        'react',
    ],
    'rules': {
        'indent': ['error', 4],
        'operator-linebreak': ['error', 'after', {
                'overrides': {
                    '?': 'before',
                    ':': 'before'
                }
            }
        ],
        'quotes': ["error", "double", { 
                "avoidEscape": true,
                "allowTemplateLiterals": true
            }
        ],
        "quote-props": ["error", "as-needed", { 
                "keywords": true,
                "unnecessary": true
            }
        ],
        "comma-dangle": ["error", "never"],
        "semi": ["error", "always"],
        "no-extra-parens": ["error", "all", {
                "ignoreJSX": "multi-line"
            }
        ],
        "class-methods-use-this": "error",
        "consistent-return": "error",
        "curly": ["error", "all"],
        "dot-location": ["error", "property"],
        "eqeqeq": ["error", "always"],
        "no-constructor-return": "error",
        "no-else-return": ["error", {
                allowElseIf: false
            }
        ],
        "no-multi-spaces": "error",
        "no-param-reassign": ["error", { 
                "props": false 
            }
        ],
        "no-self-compare": "error",
        "no-throw-literal": "error",
        "no-unmodified-loop-condition": "error",
        "no-unused-expressions": "error",
        "no-useless-return": "error",
        "no-shadow": "error",
        "array-bracket-spacing": ["error", "never"],
        "array-element-newline": ["error", "consistent"],
        "block-spacing": ["error", "always"],
        "brace-style": ["error", "stroustrup"],
        "comma-spacing": ["error", {
                "before": false,
                "after": true
            }
        ],
        "comma-style": ["error", "last"],
        "computed-property-spacing": ["error", "never"],
        "eol-last": ["error", "always"],
        "func-call-spacing": ["error", "never"],
        "func-names": ["error", "always"],
        "func-style": ["error", "declaration", {
                "allowArrowFunctions": true
            }
        ],
        "function-call-argument-newline": ["error", "consistent"],
        "function-paren-newline": ["error", "consistent"],
        "jsx-quotes": ["error", "prefer-double"],
        "key-spacing": ["error", {
            "beforeColon": false,
            "afterColon": true
            }
        ],
        "multiline-ternary": ["error", "always-multiline"],
        "no-lonely-if": "error",
        "no-multi-assign": "error",
        "no-multiple-empty-lines": "error",
        "no-trailing-spaces": ["error", {
                "ignoreComments": true
            }
        ],
        "no-unneeded-ternary": "error",
        "no-whitespace-before-property": "error",
        "object-curly-newline": ["error", {
                "consistent": true 
            }
        ],
        "object-curly-spacing": ["error", "always"],
        "operator-assignment": ["error", "always"],
        "semi-spacing": "error",
        "semi-style": ["error", "last"],
        "space-before-blocks": "error",
        "space-infix-ops": "error",
        "space-unary-ops": ["error", {
                "words": true,
                "nonwords": false
            }
        ],
        "switch-colon-spacing": ["error", {
                "after": true,
                "before": false
            }
        ],
        "arrow-parens": ["error", "always"],
        "arrow-spacing": "error",
        "no-var": "error",
        "prefer-const": ["error", {
                "destructuring": "all"
            }
        ],
        "prefer-template": "error"
    }
};