// Using the informal draft spec to support the newest features of dart
// https://spec.dart.dev/DartLangSpecDraft.pdf

const DIGITS = token(sep1(/[0-9]+/, /_+/))
const HEX_DIGITS = token(sep1(/[A-Fa-f0-9]+/, '_'))

//Everything above RelationalTypeCast was incremented from its original value
//This was to get type casting issues finally fixed.

const DART_PREC = {
  IMPORT_EXPORT: 19,
  TYPE_IDENTIFIER: 18, //was: 17
  DOT_IDENTIFIER: 19, //was: 18
  UNARY_POSTFIX: 17,
  UNARY_PREFIX: 16,
  Multiplicative: 15, // *, /, ˜/, % Left
  Additive: 14, // +, - Left
  Shift: 13, // <<, >>, >>> Left
  TYPE_ARGUMENTS: 13,
  Bitwise_AND: 12, // & Left
  Bitwise_XOR: 11, // ˆ Left
  Bitwise_Or: 10, // | Left
  RelationalTypeCast: 9, // <, >, <=, >=, as, is, is! None 8
  RelationalTypeTest: 9,
  Relational: 8, // <, >, <=, >=, as, is, is! None 8
  Equality: 7, // ==, != None 7
  Logical_AND: 6, // AND && Left
  Logical_OR: 5, // Or || Left
  If: 4, //-null ?? Left
  Conditional: 3, // e1?e2:e3 Right 3
  Cascade: 2, // .. Left
  Assignment: 1, // =, *=, /=, +=, -=, &=, ˆ=, etc. Right
  BUILTIN: 0,
  TRY: 0,
  // Added by Ben for experimentation.
  SELECTOR_IN_PRIMARY: 1,
  SELECTOR_IN_ASSIGNMENT: 0,
  TYPE_ARGS: 1,
}

// TODO: general things to add
// both string types
//get protocols in classes?
// todo: type test operators: as, is, and is!
//todo: assignment operators: ??=, and ~/=
//todo: ?? operator
// todo: cascade notation: dot dot accesses each object
//todo: conditional member access: blah?.foo
//todo: rethrow keyword
//todo: override operator notations
//todo: correct import statements to be strings
//todo: sync* and async* functions, plus yields

//DONE: override shorter constructor notations?

module.exports = grammar({
  name: 'dart',

  externals: $ => [
    $._automatic_semicolon,
    $._template_chars_double,
    $._template_chars_single,
    $._template_chars_double_single,
    $._template_chars_single_single,
    $._template_chars_raw_slash,
  ],

  extras: $ => [
    $.comment,
    $.documentation_comment,
    // $.multiline_comment,
    /\s/,
  ],

  supertypes: $ => [
    // $.expression_,
    // $._declaration,
    // $.statement,
    // $.literal,
    // $._primary,
    // $.type,
    // $._simple_type,
    // $.type,
  ],

  inline: $ => [$._ambiguous_name],

  conflicts: $ => [
    [$.enclosed_body, $.set_or_map_literal],
    [$._primary, $.function_signature],
    [$._type_name, $._primary, $.function_signature],
    [$._primary, $._type_name],
    [$.variable_declaration, $.initialized_variable_definition],
    [$.final_const_var_or_type, $.function_signature],
    [$._primary, $.function_formal_parameter],
    [$._primary, $.simple_formal_parameter],
    [$._primary, $.labeled_statement],
    [$._primary, $._type_name, $.function_formal_parameter],
    [$.final_const_var_or_type, $.function_formal_parameter],
    [$._primary, $.constructor_param],
    [$.normal_formal_parameters],
    [$.postfix_expression],
    [$.declared_identifier],
    [$.equality_expression],
    [$._argument_list],
    [$.variable_declaration, $.initialized_identifier],
    [$.declaration, $.external_and_static_],
    [$.method_signature, $._static_or_covariant],
    [$.constructor_signature, $._formal_parameter_part],
    // [$._type_not_function, $.type_not_void],
    [$._cascade_subsection],
    [$.expression_],
    // [$._real_expression, $._below_relational_expression],
    [$.postfix_expression_],
    [$._top_level_definition, $.lambda],
    [$._top_level_definition, $.final_const_var_or_type],
    [
      $._top_level_definition,
      $.const_object_expression,
      $.final_const_var_or_type,
    ],
    [$.final_const_var_or_type, $.const_object_expression],
    [$.final_const_var_or_type],
    [$.type_parameter, $._type_name],
    [$.class_definition],
    [$.normal_formal_parameter],
    [$.library_name, $.dotted_identifier_list],
    [$._top_level_definition, $.inferred_type],
    [$.final_const_var_or_type, $._top_level_definition, $.function_signature],
    [$._assignable_selector_part, $.selector],
    [$._assignable_selector_part, $.postfix_expression_],
    [$._assignable_selector_part, $.postfix_expression],
    [$._primary, $.assignable_expression],
    [$.simple_formal_parameter, $.assignable_expression],
    // [$._type_name, $._primary, $.assignable_expression],
    [$.assignable_expression, $.postfix_expression],
    [$.assignable_expression, $.postfix_expression_],
    // [$._type_name, $.assignable_expression],
    // [$._type_name, $.function_signature],
    [$._type_name, $.function_formal_parameter],
    [$._type_name],
    // [$.assignment_expression, $.expression_],
    [$.assignable_expression],
    [$.method_signature, $.declaration, $._static_or_covariant],
    [$.type_arguments],
    [$._primary, $._type_name, $.assignable_expression],
    [$._primary, $._type_name, $.assignable_expression, $.function_signature],
    [
      $._primary,
      $._type_name,
      $.assignable_expression,
      $.function_formal_parameter,
    ],
    [$._type_name, $.function_signature],
    // [$.relational_operator, $._shift_operator],
    [$.declaration, $.external_],
    [$.relational_expression],
    [
      $.factory_constructor_signature,
      $.redirecting_factory_constructor_signature,
    ],
    [$._function_type_tail],
    [$._type_not_void_not_function, $._function_type_tail],
    [$.type_not_void],
    [$._type_not_void_not_function],
    [$.function_signature],

    // serenade
    [$._for_loop_parts, $.block_initializer],
    [$.if],
    [$.if_clause, $.else_if_clause],
    // [$.superclass_extends, $.superclass_mixins],
    [$.declaration_variant_constructor_signature, $.declaration],
    [
      $.declaration_variant_constructor_signature,
      $.declaration,
      $.external_and_static_,
    ],
    [$.method_signature_variant_static, $.declaration, $._static_or_covariant],
    [$.declaration_variant_getter_signature, $.external_],
    [$.declaration_variant_operator_signature, $.external_and_static_],
    [
      $.declaration_variant_constructor_signature,
      $.declaration_variant_operator_signature,
      $.external_and_static_,
    ],
    [
      $.method_signature_variant_static,
      $.declaration_variant_function_signature,
      $._static_or_covariant,
    ],
    [
      $.declaration_variant_static_final_declaration_list,
      $._static_or_covariant,
    ],
    [$.initialized_identifier_, $.static_final_declaration],
    [
      $.assignable_expression,
      $.initialized_identifier_,
      $.static_final_declaration,
    ],
    [$._primary, $.initialized_identifier_],
    [
      $.top_level_variant_static_final_declaration_list,
      $.top_level_initialized_identifier,
      $.final_const_var_or_type,
      $.function_signature,
    ],
    [$.top_level_initialized_identifier, $.final_const_var_or_type],
    [
      $.top_level_variant_static_final_declaration_list,
      $.const_object_expression,
      $.final_const_var_or_type,
    ],
    [
      $.top_level_variant_static_final_declaration_list,
      $.top_level_initialized_identifier,
      $.final_const_var_or_type,
    ],
    [
      $.top_level_variant_static_final_declaration_list,
      $.final_const_var_or_type,
    ],
    [$.top_level_variant_definition, $.lambda],
    // [$.top_level_variant_definition],
    // [$.top_level_variant_prototypes],
    // [$.top_level_initialized_identifier],
    // [$.top_level_variant_static_final_declaration_list],
    // [$.enum],
    // 4:  Add a conflict for these rules: `top_level_variant_static_final_declaration_list`, `final_const_var_or_type`

    // `top_level_variant_static_final_declaration_list`, ``, `final_const_var_or_type`
    // e rules: `top_level_variant_static_final_declaration_list`, ``, `final_const_var_or_type`
    // ``, ``, ``, ``

    // ``, `initialized_identifier_`, `static_final_declaration`
  ],

  word: $ => $.identifier,

  rules: {
    // Page 188 libraryDeclaration
    program: $ =>
      seq(
        optional($.script_tag),
        optional($.library_name),
        optional_with_placeholder(
          'import_list',
          repeat(alias($.import_or_export, $.import))
        ),
        repeat($.part_directive),
        repeat($.part_of_directive),
        // The precedence here is to make sure that this rule is matched before any of the statement rules are matched for testing.
        optional_with_placeholder(
          'type_declaration_list',
          repeat1(prec.dynamic(22, $.top_level_definition))
        ),
        //for testing:
        optional_with_placeholder('statement_list', repeat($.statement))
      ),

    top_level_definition: $ => field('statement', $.top_level_definition_),
    top_level_definition_: $ => seq($._top_level_definition),

    // Page 187 topLevelDefinition
    _top_level_definition: $ =>
      choice(
        $.class_definition,
        $.enum,
        $.extension_declaration,
        $.mixin,
        $.type_alias,
        $.top_level_variant_prototypes,
        alias($.top_level_variant_definition, $.function),
        $.top_level_variant_static_final_declaration_list,
        $.top_level_initialized_identifier
      ),

    top_level_variant_definition: $ =>
      seq(
        optional_with_placeholder('decorator_list', $.metadata_),
        choice($.function_signature, $.getter_signature, $.setter_signature),
        $.function_body
      ),
    top_level_variant_static_final_declaration_list: $ =>
      seq(
        optional_with_placeholder('decorator_list', $.metadata_),
        optional_with_placeholder(
          'modifier_list',
          choice($.final_builtin, $.const_builtin)
        ),
        optional_with_placeholder('type_optional', $.type),
        $.static_final_declaration_list,
        $._semicolon
      ),

    top_level_initialized_identifier: $ =>
      seq(
        optional_with_placeholder('decorator_list', $.metadata_),
        optional_with_placeholder(
          'modifier_list',
          seq(optional($.late_builtin), optional($.final_builtin))
        ),
        optional_with_placeholder(
          'type_optional',
          choice($.type, $.inferred_type)
        ),
        $.initialized_identifier_list,
        $._semicolon
      ),

    top_level_variant_prototypes: $ =>
      seq(
        optional_with_placeholder('decorator_list', $.metadata_),
        optional_with_placeholder('modifier_list', $.external_builtin),
        choice($.function_signature, $.getter_signature, $.setter_signature),
        $._semicolon
      ),

    /**************************************************************************************************
     *********************************Literals**********************************************************
     ***************************************************************************************************
     ****These are the Literals from section 16.4-9 (Page 84-110) of the dart specification*************
     ***************************************************************************************************
     ***************************************************************************************************/

    literal: $ =>
      choice(
        $.decimal_integer_literal,
        $.hex_integer_literal,
        $.decimal_floating_point_literal,
        $.true,
        $.false,
        $.string_literal,
        $.null_literal,
        $.symbol_literal,
        $.list_literal,
        $.set_or_map_literal
      ),

    /****This is the symbol literals from section 16.8 (Page 99) of the dart specification****************/
    symbol_literal: $ => seq('#', $.identifier),
    //symbol literal can also be an operator?

    /**************************************************************************************************
     *********************************Numeric Literals**************************************************
     ***************************************************************************************************
     ****These are the Numeric Literals from section 16.5 (Page 84-85) of the dart specification********
     ***************************************************************************************************
     ***************************************************************************************************/

    decimal_integer_literal: $ => token(DIGITS),

    hex_integer_literal: $ => token(seq(choice('0x', '0X'), HEX_DIGITS)),

    decimal_floating_point_literal: $ =>
      token(
        choice(
          seq(
            DIGITS,
            '.',
            DIGITS,
            optional(seq(/[eE]/, optional(choice('-', '+')), DIGITS))
          ),
          seq(
            '.',
            DIGITS,
            optional(seq(/[eE]/, optional(choice('-', '+')), DIGITS))
          ),
          seq(DIGITS, /[eE]/, optional(choice('-', '+')), DIGITS),
          seq(DIGITS, optional(seq(/[eE]/, optional(choice('-', '+')), DIGITS)))
        )
      ),

    /**************************************************************************************************
     *********************************Boolean Literals**************************************************
     ***************************************************************************************************
     ****These are the boolean from section 16.6 (Page 86) of the dart specification********************
     ***************************************************************************************************
     ***************************************************************************************************/
    true: $ => prec(DART_PREC.BUILTIN, 'true'),

    false: $ => prec(DART_PREC.BUILTIN, 'false'),

    /**************************************************************************************************
     *********************************String Parts******************************************************
     ***************************************************************************************************
     ****These are the parts of String from section 16.7 (Page 86-92) of the dart specification*********
     ***************************************************************************************************
     ***************************************************************************************************/
    string_literal: $ =>
      repeat1(
        choice(
          $._string_literal_double_quotes,
          $._string_literal_single_quotes,
          $._string_literal_double_quotes_multiple,
          $._string_literal_single_quotes_multiple,
          //raw, separate later
          $._raw_string_literal_double_quotes,
          $._raw_string_literal_single_quotes,
          $._raw_string_literal_double_quotes_multiple,
          $._raw_string_literal_single_quotes_multiple
        )
      ),
    _string_literal_double_quotes: $ =>
      seq(
        '"',
        repeat(
          choice(
            $._template_chars_double_single,
            "'",
            $.escape_sequence,
            $._sub_string_test,
            $.template_substitution
          )
        ),
        '"'
      ),
    _string_literal_single_quotes: $ =>
      seq(
        "'",
        repeat(
          choice(
            $._template_chars_single_single,
            '"',
            $.escape_sequence,
            $._sub_string_test,
            $.template_substitution
          )
        ),
        "'"
      ),
    _string_literal_double_quotes_multiple: $ =>
      prec.left(
        seq(
          '"""',
          repeat(
            choice(
              $._template_chars_double,
              "'",
              '"',
              $.escape_sequence,
              $._sub_string_test,
              $.template_substitution
            )
          ),
          '"""'
        )
      ),
    _string_literal_single_quotes_multiple: $ =>
      prec.left(
        seq(
          "'''",
          repeat(
            choice(
              $._template_chars_single,
              '"',
              "'",
              $.escape_sequence,
              $._sub_string_test,
              $.template_substitution
            )
          ),
          "'''"
        )
      ),
    _raw_string_literal_double_quotes: $ =>
      seq(
        'r"',
        repeat(
          choice(
            $._template_chars_double_single,
            // /[^\n"]*/,
            "'",
            $._template_chars_raw_slash,
            // '\\',
            $._unused_escape_sequence,
            $._sub_string_test,
            '$'
          )
        ),
        '"'
      ),
    _raw_string_literal_single_quotes: $ =>
      seq(
        "r'",
        repeat(
          choice(
            $._template_chars_single_single,
            // /[^\n']/,
            '"',
            $._template_chars_raw_slash,
            // '\\',
            $._unused_escape_sequence,
            $._sub_string_test,
            '$'
          )
        ),
        "'"
      ),
    _raw_string_literal_double_quotes_multiple: $ =>
      prec.left(
        seq(
          'r"""',
          // $._triple_double_quote_end,
          repeat(
            choice(
              $._template_chars_double,
              "'",
              // '\\',
              $._template_chars_raw_slash,
              '"',
              $._unused_escape_sequence,
              $._sub_string_test,
              '$'
            )
          ),
          '"""'
          // $._triple_double_quote_end
        )
      ),
    _raw_string_literal_single_quotes_multiple: $ =>
      prec.left(
        seq(
          "r'''",
          // $._triple_quote_end,
          repeat(
            choice(
              $._template_chars_single,
              '"',
              "'",
              // '\\',
              $._template_chars_raw_slash,
              $._unused_escape_sequence,
              $._sub_string_test,
              '$'
            )
          ),
          "'''"
          // $._triple_quote_end
        )
      ),
    _triple_quote_end: $ => token("'''"),
    _triple_double_quote_end: $ => token('"""'),
    template_substitution: $ =>
      seq(
        '$',
        choice(seq('{', $.expression_, '}'), $.identifier_dollar_escaped)
      ),
    _sub_string_test: $ => seq('$', /[^a-zA-Z_{]/),
    _string_interp: $ => /\$((\w+)|\{([^{}]+)\})/, // represents $word or ${word} for now
    _unused_escape_sequence: $ =>
      token.immediate(
        seq(
          '\\',
          choice(
            /[^xu0-7]/,
            /[0-7]{1,3}/,
            /x[0-9a-fA-F]{2}/,
            /u[0-9a-fA-F]{4}/,
            /u{[0-9a-fA-F]+}/
          )
        )
      ),
    escape_sequence: $ => $._unused_escape_sequence,

    /**************************************************************************************************
     *********************************Collection Literals***********************************************
     ***************************************************************************************************
     ****These are the collection literals from section 16.9 (Page 92-108) of the dart specification****
     ***************************************************************************************************
     ***************************************************************************************************/
    list_literal: $ =>
      seq(
        optional($.const_builtin),
        optional($.type_arguments),
        '[',
        optional_with_placeholder('list', $.list_elements),
        ']'
      ),

    list_elements: $ =>
      commaSep1TrailingComma(alias($._element, $.list_element)),

    set_or_map_literal: $ =>
      seq(
        optional($.const_builtin),
        optional($.type_arguments),
        '{',
        commaSepTrailingComma($._element),
        '}'
      ),

    key_value_pair: $ =>
      seq(
        field('key_value_pair_key', $.expression_),
        ':',
        field('key_value_pair_value', $.expression_)
      ),
    // pair_or_element: $ => seq(
    //     field('key', $.expression_),
    //     optional(
    //         seq(
    //             ':',
    //             field('value', $.expression_)
    //         )
    //     )
    // ),

    _element: $ =>
      choice(
        $.expression_,
        $.key_value_pair,
        $.spread_element,
        $.if_element,
        $.for_element
      ),

    /****This is the null literal from section 16.4 (Page 84) of the dart specification****/
    null_literal: $ => prec(DART_PREC.BUILTIN, 'null'),

    /**************************************************************************************************
     *********************************Expressions*******************************************************
     ***************************************************************************************************
     ****These are the expressions from section 16.9 (Page 110-166) of the dart specification***********
     ***************************************************************************************************
     ***************************************************************************************************/
    expression_: $ =>
      choice(
        alias($.assignment_expression, $.assignment),
        alias($.throw_expression, $.throw),
        seq($._real_expression, repeat($.cascade_section))
      ),
    _expression_without_cascade: $ =>
      choice(
        alias($.assignment_expression_without_cascade, $.assignment),
        $._real_expression,
        alias($.throw_expression_without_cascade, $.throw)
      ),
    _real_expression: $ =>
      choice(
        $.conditional_expression,
        $.logical_or_expression,
        $.if_null_expression,
        $.additive_expression,
        $.multiplicative_expression,
        $.relational_expression,
        $.equality_expression,
        $.logical_and_expression,
        $.bitwise_and_expression,
        $.bitwise_or_expression,
        $.bitwise_xor_expression,
        $.shift_expression,
        $.type_cast_expression,
        $.type_test_expression,
        $.unary_expression_
      ),

    // _below_relational_expression: $ => choice(
    //     // UNARY_POSTFIX: 16,
    //     // UNARY_PREFIX: 15,
    //     // Multiplicative: 14, // *, /, ˜/, % Left
    //     // Additive: 13, // +, - Left
    //     // Shift: 12, // <<, >>, >>> Left
    //     // Bitwise_AND: 11, // & Left
    //     // Bitwise_XOR: 10, // ˆ Left
    //     // Bitwise_Or: 9 , // | Left
    //     // $.type_cast_expression,
    //     $.unary_expression_,
    //     $.multiplicative_expression,
    //     $.additive_expression,
    //     $.shift_expression,
    //     $.bitwise_and_expression,
    //     $.bitwise_or_expression,
    //     $.bitwise_xor_expression,
    //
    // ),
    //
    // _below_relational_type_cast_expression: $ => prec(
    //     DART_PREC.RelationalTypeCast,
    //     choice(
    //         // UNARY_POSTFIX: 16,
    //         // UNARY_PREFIX: 15,
    //         // Multiplicative: 14, // *, /, ˜/, % Left
    //         // Additive: 13, // +, - Left
    //         // Shift: 12, // <<, >>, >>> Left
    //         // Bitwise_AND: 11, // & Left
    //         // Bitwise_XOR: 10, // ˆ Left
    //         // Bitwise_Or: 9 , // | Left
    //         $.unary_expression_,
    //         $.multiplicative_expression,
    //         $.additive_expression,
    //         $.shift_expression,
    //         $.bitwise_and_expression,
    //         $.bitwise_or_expression,
    //         $.bitwise_xor_expression,
    //
    //     )
    // ),

    throw_expression: $ => seq('throw', $.expression_),
    throw_expression_without_cascade: $ =>
      seq('throw', $._expression_without_cascade),

    // cast_expression: $ => prec(PREC.CAST, seq(
    //     '(',
    //     sep1(field('type', $.type), '&'),
    //     ')',
    //     field('value', $.expression_)
    // )),
    /**************************************************************************************************
     ***********************Assignment Expressions*****************************************************
     ***************************************************************************************************
     ****These are the assignment expressions from section 16.34 (Page 159) of the dart DRAFT**********
     * specification. (Very different from the formal spec in this instance)****************************
     ***************************************************************************************************
     ***************************************************************************************************/

    assignment_expression: $ =>
      prec.right(
        DART_PREC.Assignment,
        seq(
          //right
          field('assignment_variable', $.assignable_expression),
          field('operator', $._assignment_operator),
          field('assignment_value', $.expression_)
        )
      ),

    assignment_expression_without_cascade: $ =>
      prec.right(
        DART_PREC.Assignment,
        seq(
          //right
          field('assignment_variable', $.assignable_expression),
          field('operator', $._assignment_operator),
          field('assignment_value', $._expression_without_cascade)
        )
      ),

    assignable_expression: $ =>
      choice(
        seq($._primary, $._assignable_selector_part), // dart issue?
        seq($.super, $.unconditional_assignable_selector),
        seq($.constructor_invocation, $._assignable_selector_part),
        $.identifier
      ),
    _assignable_selector_part: $ =>
      seq(repeat($.selector), $._assignable_selector),
    //'+=', '-=', '*=', '/=', '&=', '|=', '^=', '%=', '<<=', '>>=', '>>>=', '??='
    //todo: use the op names in place of these.
    _assignment_operator: $ =>
      choice(
        '=',
        seq(
          choice(
            $._multiplicative_operator,
            $._shift_operator,
            $._bitwise_operator,
            $._additive_operator,
            '??'
          ),
          '='
        )
      ),

    // binary_expression: $ => choice(
    //     ...[
    //         ['>', PREC.REL],
    //         ['<', PREC.REL],
    //         ['==', PREC.REL],
    //         ['>=', PREC.REL],
    //         ['<=', PREC.REL],
    //         ['!=', PREC.REL],
    //         ['&&', PREC.AND],
    //         ['||', PREC.OR],
    //         ['+', PREC.PLUS],
    //         ['-', PREC.PLUS],
    //         ['*', PREC.TIMES],
    //         ['/', PREC.TIMES],
    //         ['&', PREC.AND],
    //         ['|', PREC.OR],
    //         ['^', PREC.OR],
    //         ['%', PREC.TIMES],
    //         ['<<', PREC.TIMES],
    //         ['>>', PREC.TIMES],
    //         ['>>>', PREC.TIMES],
    //     ].map(([operator, precedence]) =>
    //         prec.left(precedence, seq(
    //             field('left', $.expression_),
    //             field('operator', operator),
    //             field('right', $.expression_)
    //         ))
    //     )),

    // instanceof_expression: $ => prec(PREC.REL, seq(
    //     field('left', $.expression_),
    //     'instanceof',
    //     field('right', $.type)
    // )),

    lambda: $ =>
      seq(
        field('parameters', $.function_signature),
        field('body', $.function_body)
      ),

    function_expression: $ =>
      seq(
        field('parameters', $._formal_parameter_part),
        field('body', $.function_expression_body)
      ),

    inferred_parameters: $ =>
      seq('(', field('parameter_list', commaSep1($.inferred_parameter)), ')'),

    inferred_parameter: $ => field('parameter', $.identifier),

    if_null_expression: $ =>
      prec.left(
        //left
        DART_PREC.If,
        seq(
          field(
            'first',
            $._real_expression // logical_or_expression
          ),
          $._if_null_expression
          // optional(
          //     $._if_null_expression
          // )
        )
      ),

    _if_null_expression: $ =>
      repeat1(seq('??', field('second', $._real_expression))),

    conditional_expression: $ =>
      prec.left(
        //left
        DART_PREC.Conditional,
        seq(
          // $.if_null_expression,
          $._real_expression,
          seq(
            '?',
            field('consequence', $._expression_without_cascade),
            ':',
            field('alternative', $._expression_without_cascade)
          )
        )
      ),

    logical_or_expression: $ =>
      prec.left(
        //left
        DART_PREC.Logical_OR,
        sep2($._real_expression, '||')
      ),

    logical_and_expression: $ =>
      prec.left(
        //left
        DART_PREC.Logical_AND,
        sep2($._real_expression, '&&')
      ),

    equality_expression: $ =>
      prec(
        //neither
        DART_PREC.Equality,
        choice(
          seq(
            // $.relational_expression,
            $._real_expression,
            // optional(
            //
            // )

            $.equality_operator,
            $._real_expression
            // $.relational_expression
          ),
          seq(
            $.super,
            $.equality_operator,
            // $.relational_expression
            $._real_expression
          )
        )
      ),

    equality_operator: $ => token(choice('==', '!=')),
    type_cast_expression: $ =>
      prec.left(
        DART_PREC.RelationalTypeCast,
        seq(
          // $._below_relational_type_cast_expression,
          $._real_expression,
          $.type_cast
        )
      ),
    type_test_expression: $ =>
      prec(
        DART_PREC.RelationalTypeTest,
        seq(
          // $._below_relational_type_cast_expression,
          $._real_expression,
          $.type_test
        )
      ),
    // _raw_type_cast: $ => prec.right(
    //     seq(
    //         $._below_relational_type_cast_expression,
    //         $.type_cast,
    //     )
    // ),

    relational_expression: $ =>
      prec(
        // neither
        DART_PREC.Relational,
        choice(
          // $._raw_type_cast,
          seq(
            // $.bitwise_or_expression,
            // $._below_relational_type_cast_expression,
            // TODO: The spec says optional but it breaks tests, and I'm not sure in a good way.
            // Modified to account for type casts being compared relationally!
            // I am not certain this is what designers intended. (see other comments on github)
            // optional(
            $._real_expression,
            $.relational_operator,
            $._real_expression
            // choice(
            //     $.type_test,
            //     $.type_cast,
            //     seq(
            //         $.relational_operator,
            //         $._real_expression
            //     )
            // )
            // ),
          ),
          // seq(
          //     // $.bitwise_or_expression,
          //     choice(
          //         $._raw_type_cast,
          //         $._below_relational_type_cast_expression
          //     ),
          //     $.relational_operator,
          //     choice(
          //         $._raw_type_cast,
          //         $._below_relational_type_cast_expression
          //     )
          // ),
          seq($.super, $.relational_operator, $._real_expression)
        )
      ),

    relational_operator: $ => choice('<', '>', '<=', '>='),

    //BITWISE EXPRESSIONS
    bitwise_or_expression: $ =>
      binaryRunLeft($._real_expression, '|', $.super, DART_PREC.Bitwise_Or),
    bitwise_xor_expression: $ =>
      binaryRunLeft($._real_expression, '^', $.super, DART_PREC.Bitwise_XOR),
    bitwise_and_expression: $ =>
      binaryRunLeft($._real_expression, '&', $.super, DART_PREC.Bitwise_AND),
    shift_expression: $ =>
      binaryRunLeft(
        $._real_expression,
        $.shift_operator,
        $.super,
        DART_PREC.Shift
      ),
    additive_expression: $ =>
      binaryRunLeft(
        $._real_expression,
        $.additive_operator,
        $.super,
        DART_PREC.Additive
      ),
    multiplicative_expression: $ =>
      binaryRunLeft(
        $.unary_expression_,
        $.multiplicative_operator,
        $.super,
        DART_PREC.Multiplicative
      ),
    bitwise_operator: $ => $._bitwise_operator,
    _bitwise_operator: $ => choice('&', '^', '|'),
    shift_operator: $ => $._shift_operator,
    _shift_operator: $ => choice('<<', '>>', '>>>'),
    additive_operator: $ => $._additive_operator,
    _additive_operator: $ => token(choice('+', '-')),
    multiplicative_operator: $ => $._multiplicative_operator,
    _multiplicative_operator: $ => choice('*', '/', '%', '~/'),

    unary_expression_: $ =>
      prec(
        DART_PREC.UNARY_PREFIX,
        choice($.postfix_expression_, $.unary_expression)
      ),

    unary_expression: $ =>
      prec(
        //neither
        DART_PREC.UNARY_PREFIX,
        choice(
          seq($.prefix_operator, $.unary_expression_),
          $.await_expression,
          // prec(DART_PREC.UNARY_POSTFIX, $.postfix_expression_),
          seq(choice($.minus_operator, $.tilde_operator), $.super),
          seq($.increment_operator, $.assignable_expression)
        )
      ),

    postfix_expression_: $ =>
      choice(seq($._primary, repeat($.selector)), $.postfix_expression),

    postfix_expression: $ =>
      choice(
        seq($.assignable_expression, $.postfix_operator),
        seq($.constructor_invocation, repeat($.selector))
      ),

    postfix_operator: $ => $.increment_operator,

    increment_operator: $ => token(choice('++', '--')),

    spread_element: $ => seq('...', optional('?'), $.expression_),

    selector: $ =>
      choice(
        // '!',
        $._exclamation_operator,
        $._assignable_selector,
        $.argument_part
      ),

    prefix_operator: $ =>
      choice($.minus_operator, $.negation_operator, $.tilde_operator),

    minus_operator: $ => '-',
    negation_operator: $ => $._exclamation_operator,
    _exclamation_operator: $ => '!',
    tilde_operator: $ => '~',

    await_expression: $ => seq('await', $.unary_expression_),

    type_test: $ => seq($.is_operator, $.type_not_void),

    is_operator: $ => seq(token('is'), optional($._exclamation_operator)),

    type_cast: $ => seq($.as_operator, $.type_not_void),

    as_operator: $ => token('as'),

    new_expression: $ =>
      seq(
        $._new_builtin,
        $.type_not_void,
        optional($._dot_identifier),
        $.arguments
      ),

    _dot_identifier: $ =>
      prec.dynamic(DART_PREC.DOT_IDENTIFIER, seq('.', $.identifier)),
    const_object_expression: $ =>
      seq(
        $.const_builtin,
        $.type_not_void,
        optional($._dot_identifier),
        $.arguments
      ),

    _primary: $ =>
      choice(
        $.literal,
        $.function_expression,
        $.identifier,
        $.new_expression,
        $.const_object_expression,
        seq('(', $.expression_, ')'),
        // $.class_literal,
        $.this,
        seq($.super, $.unconditional_assignable_selector)
        // $.object_creation_expression,
        // $.field_access,
        // $.array_access,
        // $.method_invocation,
        // $.method_reference,
      ),

    parenthesized_condition: $ =>
      seq('(', alias($.expression_, $.condition), ')'),

    _compound_access: $ => choice('.', '?.'),

    constructor_invocation: $ =>
      seq($._type_name, $.type_arguments, '.', $.identifier, $.arguments),

    arguments: $ =>
      seq(
        '(',
        optional_with_placeholder(
          'argument_list',
          seq($._argument_list, optional(','))
        ),
        ')'
      ),

    _argument_list: $ =>
      choice(
        commaSep1($.named_argument),
        seq(
          commaSep1($.argument),
          repeat(seq(',', commaSep1($.named_argument)))
        )
      ),

    argument: $ => $.expression_,

    named_argument: $ => field('argument', seq($.label, $.expression_)),

    cascade_section: $ =>
      prec.left(
        DART_PREC.Cascade,
        seq(
          '..',
          $.cascade_selector,
          repeat($.argument_part),
          repeat($._cascade_subsection),
          optional($._cascade_assignment_section)
        )
      ),

    // prec.left(
    // DART_PREC.Cascade,
    // ),
    _cascade_subsection: $ =>
      seq($._assignable_selector, repeat($.argument_part)),
    _cascade_assignment_section: $ =>
      seq($._assignment_operator, $._expression_without_cascade),
    cascade_selector: $ =>
      choice(
        seq(optional($._nullable_type), '[', $.expression_, ']'),
        $.identifier
      ),
    argument_part: $ =>
      seq(
        optional($.type_arguments),
        // seq(
        //     $.type_arguments,
        //     $.arguments
        // ),
        $.arguments
      ),

    unconditional_assignable_selector: $ =>
      choice(
        seq(optional($._nullable_type), '[', $.expression_, ']'),
        seq('.', $.identifier)
      ),

    conditional_assignable_selector: $ => seq('?.', $.identifier),

    _assignable_selector: $ =>
      choice(
        $.unconditional_assignable_selector,
        $.conditional_assignable_selector
      ),

    type_arguments: $ =>
      choice(
        // was prec.right
        // seq(
        //     '<',
        //     '>',
        //     optional($._nullable_type)
        // ),
        seq(
          '<',
          commaSep($.type),
          '>'
          // optional($._nullable_type)
        )
      ),

    wildcard: $ =>
      seq(optional($.metadata_), '?', optional($._wildcard_bounds)),

    _wildcard_bounds: $ => choice(seq('extends', $.type), seq($.super, $.type)),

    dimensions: $ => prec.right(repeat1(seq(optional($.metadata_), '[', ']'))),

    abstract_modifier: $ => field('modifier', 'abstract'),

    async_modifier: $ => field('modifier', 'async'),

    async_modifier_choice: $ =>
      field('modifier', choice('async', 'async*', 'sync*')),

    required_modifier: $ => field('modifier', 'required'),

    // Statements
    statement: $ =>
      choice(
        $.enclosed_body,
        alias($.local_variable_declaration, $.variable_declaration),
        $.for,
        $.while,
        $.do_while,
        $.switch,
        $.if,
        //TODO: add rethrow statement.
        // $._declaration,

        $.try,
        $.break,
        $.continue,
        $.return,
        $.yield_statement,
        $.yield_each_statement,
        $.expression_statement,
        $.assert,
        $.labeled_statement,
        $.lambda
      ),

    enclosed_body: $ =>
      seq(
        '{',
        optional_with_placeholder('statement_list', repeat($.statement)),
        '}'
      ),

    expression_statement: $ => seq($.expression_, $._semicolon),

    labeled_statement: $ => seq($.identifier, ':', $.statement),

    assert: $ => seq($.assertion, ';'),

    assertion: $ =>
      seq(
        $.assert_builtin_,
        '(',
        $.expression_,
        optional(seq(',', $.expression_, optional(','))),
        ')'
      ),

    switch: $ =>
      seq('switch', $.parenthesized_condition, field('body', $.switch_block)),

    switch_block: $ =>
      seq('{', repeat(choice($.switch_label, $.statement)), '}'),

    switch_label: $ =>
      choice(seq($.case_builtin, $.expression_, ':'), seq('default', ':')),

    do_while: $ =>
      seq(
        'do',
        field('body', $.statement),
        'while',
        $.parenthesized_condition,
        $._semicolon
      ),

    break: $ => seq($.break_builtin_, optional($.identifier), $._semicolon),

    continue: $ => seq('continue', optional($.identifier), $._semicolon),

    yield_statement: $ => seq('yield', $.expression_, $._semicolon),

    yield_each_statement: $ => seq('yield', '*', $.expression_, $._semicolon),

    return: $ =>
      seq(
        'return',
        optional_with_placeholder(
          'return_value_optional',
          alias($.expression_, $.return_value)
        ),
        $._semicolon
      ),

    throw_statement: $ => seq('throw', $.expression_, $._semicolon),

    try: $ =>
      seq(
        $.try_clause,
        optional_with_placeholder('catch_list', repeat1($.catch)),
        optional_with_placeholder('finally_clause_optional', $.finally_clause)

        // choice(
        //     $.finally_clause,
        //     seq(repeat1($.catch), optional($.finally_clause))
        // )
      ),

    catch: $ =>
      choice(
        seq($.catch_clause_inner, $.enclosed_body),
        seq(
          'on',
          $.type_not_void,
          optional($.catch_clause_inner),
          $.enclosed_body
        )
      ),
    try_clause: $ => seq('try', field('body', $.enclosed_body)),
    catch_clause_inner: $ =>
      seq(
        'catch',
        '(',
        $.identifier,
        optional(seq(',', $.identifier)),
        ')'
        // field('body', $.enclosed_body)
      ),

    // catch_formal_parameter: $ => seq(
    //     optional($.metadata_),
    //     $.catch_type,
    //     $._variable_declarator_id
    // ),

    catch_type: $ => sep1($.type, '|'),

    finally_clause: $ => seq('finally', $.enclosed_body),

    if_element: $ =>
      prec.right(
        seq(
          'if',
          $.parenthesized_condition,
          field('consequence', $._element),
          optional(seq('else', field('alternative', $._element)))
        )
      ),

    // if: $ => prec.right(seq(
    //     'if',
    //     $.parenthesized_condition,
    //     field('consequence', $.statement),
    //     optional(seq('else', field('alternative', $.statement)))
    // )),
    if: $ =>
      seq(
        $.if_clause,
        optional_with_placeholder(
          'else_if_clause_list',
          repeat1($.else_if_clause)
        ),
        optional_with_placeholder('else_clause_optional', $.else_clause)
      ),

    if_clause: $ =>
      seq('if', $.parenthesized_condition, field('consequence', $.statement)),

    else_if_clause: $ =>
      prec.dynamic(
        1,
        seq(
          'else',
          'if',
          $.parenthesized_condition,
          field('consequence', $.statement)
        )
      ),

    else_clause: $ => seq('else', $.statement),

    while: $ => $.while_clause,

    while_clause: $ =>
      seq('while', $.parenthesized_condition, field('body', $.statement)),

    for: $ => seq(optional('await'), $.for_clause),

    for_clause: $ =>
      seq('for', '(', $._for_loop_parts, ')', field('body', $.statement)),

    _for_loop_parts: $ =>
      choice(
        seq(
          field('block_iterator', choice($.declared_identifier, $.identifier)),
          field('for_each_separator', 'in'),
          field('block_collection', $.expression_)
        ),
        seq(
          optional_with_placeholder(
            'block_initializer_optional',
            $.block_initializer
          ),
          optional_with_placeholder(
            'condition_optional',
            alias($.expression_, $.condition)
          ),
          $._semicolon,
          optional_with_placeholder('block_update_optional', $.block_update)
        )
      ),

    block_initializer: $ =>
      choice(
        $.local_variable_declaration,
        seq(commaSep($.expression_), $._semicolon)
      ),

    block_update: $ => commaSep1($.expression_),

    // support map weirdness?
    for_element: $ =>
      seq(
        optional('await'),
        'for',
        '(',
        $._for_loop_parts,
        ')',
        field('body', $._element)
      ),

    // Annotations

    annotation_: $ =>
      field('decorator', choice($.marker_annotation, $.annotation)),

    marker_annotation: $ =>
      seq(
        '@',
        field('decorator_expression', choice($.identifier, $.scoped_identifier))
      ),

    annotation: $ =>
      seq(
        '@',
        field(
          'decorator_expression',
          seq(choice($.identifier, $.scoped_identifier), $.arguments)
        )
      ),
    //
    // annotation_argument_list: $ => seq(
    //     '(',
    //     choice(
    //         $._element_value,
    //         commaSep($.element_value_pair),
    //     ),
    //     ')'
    // ),

    // element_value_pair: $ => seq(
    //     field('key', $.identifier),
    //     '=',
    //     field('value', $._element_value)
    // ),
    // //TODO: remove unnecessary annotation related stuff.
    // _element_value: $ => prec(1, choice(
    //     $.expression_,
    //     $.annotation_
    // )),

    // element_value_array_initializer: $ => seq(
    //     '{',
    //     commaSep($._element_value),
    //     optional(','),
    //     '}'
    // ),

    // Declarations

    _declaration: $ =>
      prec(
        1,
        choice(
          $.import_specification,
          $.class_definition,
          // $.annotation_type_declaration,
          $.enum
        )
      ),

    requires_modifier: $ => choice('transitive', $.static_modifier),

    module_name: $ =>
      choice($.identifier, seq($.module_name, '.', $.identifier)),

    import_or_export: $ =>
      prec(DART_PREC.IMPORT_EXPORT, choice($.library_import, $.library_export)),

    library_import: $ => seq(optional($.metadata_), $.import_specification),

    library_export: $ =>
      seq(
        optional($.metadata_),
        $._export,
        $.configurable_uri,
        repeat($.combinator),
        $._semicolon
      ),

    import_specification: $ =>
      choice(
        seq(
          $._import,
          $.configurable_uri,
          optional(seq($._as, $.identifier)),
          repeat($.combinator),
          $._semicolon
        ),
        seq(
          $._import,
          $.uri,
          $._deferred,
          $._as,
          $.identifier,
          repeat($.combinator),
          $._semicolon
        )
      ),

    part_directive: $ =>
      seq(optional($.metadata_), 'part', $.uri, $._semicolon),

    part_of_directive: $ =>
      seq(
        optional($.metadata_),
        'part',
        'of',
        choice($.dotted_identifier_list, $.uri),
        $._semicolon
      ),

    uri: $ => $.string_literal,

    configurable_uri: $ => seq($.uri, repeat($.configuration_uri)),

    configuration_uri: $ => seq('if', '(', $.uri_test, ')', $.uri),

    uri_test: $ =>
      seq($.dotted_identifier_list, optional(seq('==', $.string_literal))),

    combinator: $ =>
      choice(seq('show', $._identifier_list), seq('hide', $._identifier_list)),

    _identifier_list: $ => commaSep1($.identifier),

    asterisk: $ => '*',

    enum: $ =>
      seq(
        optional_with_placeholder('decorator_list', $.metadata_),
        'enum',
        field('name', $.identifier),
        field('enclosed_body', $.enum_body)
      ),

    enum_body: $ =>
      seq(
        '{',
        field(
          'enum_member_list',
          commaSep1TrailingComma(alias($.enum_member, $.member))
        ),
        '}'
      ),

    enum_member: $ => $.enum_constant,

    enum_constant: $ => seq(optional($.metadata_), field('name', $.identifier)),

    type_alias: $ =>
      seq(
        optional_with_placeholder('decorator_list', $.metadata_),
        $._typedef,
        choice(
          seq(
            $._type_name,
            optional($.type_parameter_list),
            '=',
            $.function_type,
            ';'
          ),
          seq(optional($.type), $._type_name, $._formal_parameter_part, ';')
        )
      ),

    // superclass: $ => choice(
    //     $.superclass_extends,
    //     $.superclass_mixins
    // ),
    // superclass_extends: $ => seq(
    //     field('extends_optional',
    //         seq('extends', alias($.type_not_void, $.extends_type))),

    // ),
    // superclass_mixins: $ => seq(

    //     field('mixin_list_optional', $.mixins)
    // ),

    class_definition: $ =>
      seq(
        optional_with_placeholder('decorator_list', $.metadata_),
        optional_with_placeholder('modifier_list', $.abstract_modifier),
        'class',
        choice(
          seq(
            field('name', $.identifier),
            optional(field('type_parameter_list', $.type_parameter_list)),
            optional_with_placeholder(
              'extends_optional',
              seq('extends', alias($.type_not_void, $.extends_type))
            ),
            optional_with_placeholder('mixin_list_optional', $.mixins),
            // optional(field('superclass', $.superclass)),
            optional_with_placeholder('implements_list_optional', $.interfaces),
            field('enclosed_body', $.class_body)
          ),
          $.mixin_application_class
        )
      ),

    extension_declaration: $ =>
      seq(
        optional_with_placeholder('decorator_list', $.metadata_),
        'extension',
        optional(field('name', $.identifier)),
        optional(field('type_parameter_list', $.type_parameter_list)),
        'on',
        field('class', $.type),
        field('body', $.extension_body)
      ),

    metadata_: $ => prec.right(repeat1($.annotation_)),

    type_parameter_list: $ => seq('<', commaSep1($.type_parameter), '>'),

    type_parameter: $ =>
      seq(
        optional($.metadata_),
        alias($.identifier, $.type_identifier),
        optional($._nullable_type),
        optional($.type_bound)
      ),

    type_bound: $ => seq('extends', $.type_not_void),

    mixins: $ => seq('with', $.mixin_list),

    mixin_list: $ => commaSep1(alias($.type_not_void, $.mixin_type)),

    mixin_application_class: $ =>
      seq(
        $.identifier,
        optional($.type_parameter_list),
        '=',
        $.mixin_application,
        $._semicolon
      ),

    mixin_application: $ =>
      seq(
        $.type_not_void,
        $.mixins,
        optional_with_placeholder('implements_list_optional', $.interfaces)
      ),
    mixin: $ =>
      seq(
        optional_with_placeholder('decorator_list', $.metadata_),
        $._mixin,
        $.identifier,
        optional($.type_parameter_list),
        optional_with_placeholder(
          'on_optional',
          seq('on', alias($.type_not_void_list, $.on_type))
        ),
        optional_with_placeholder('implements_list_optional', $.interfaces),
        field('enclosed_body', $.class_body)
      ),
    interfaces: $ => seq($._implements, $.implements_list),
    implements_list: $ => commaSep1(alias($.type_not_void, $.implements_type)),

    interface_type_list: $ => seq($.type, repeat(seq(',', $.type))),

    class_body: $ =>
      seq(
        '{',
        optional_with_placeholder(
          'class_member_list',
          repeat(alias($.class_member, $.member))
        ),
        '}'
      ),

    class_member: $ => choice($.property, $.method),

    property: $ =>
      seq(
        optional_with_placeholder('decorator_list', $.metadata_),
        $.declaration,
        $._semicolon
      ),

    method: $ =>
      seq(
        optional_with_placeholder('decorator_list', $.metadata_),
        $.method_signature,
        $.function_body
      ),

    extension_body: $ =>
      seq(
        '{',
        repeat(
          choice(
            seq(optional($.metadata_), $.declaration, $._semicolon),
            seq(
              optional($.metadata_),
              seq(alias($.method_signature, $.method), $.function_body)
            )
          )
        ),
        '}'
      ),

    getter_signature: $ =>
      seq(
        optional($.type),
        $._get,
        field('name', $.identifier),
        optional($._native)
      ),
    setter_signature: $ =>
      seq(
        optional($.type),
        $._set,
        field('name', $.identifier),
        $._formal_parameter_part,
        optional($._native)
      ),
    method_signature: $ =>
      choice(
        seq($.constructor_signature, optional($.initializers)),
        $.factory_constructor_signature,
        $.method_signature_variant_static,
        $.operator_signature
      ),

    method_signature_variant_static: $ =>
      seq(
        optional_with_placeholder('modifier_list', $.static_modifier),
        choice($.function_signature, $.getter_signature, $.setter_signature)
      ),

    declaration_variant_factory_constructor_signature: $ =>
      seq(
        optional_with_placeholder(
          'modifier_list',
          seq(optional($.external_), optional($.const_builtin))
        ),
        $.factory_constructor_signature,
        optional($._native)
      ),

    declaration_variant_constructor_signature: $ =>
      seq(
        optional_with_placeholder('modifier_list', $.external_),
        $.constructor_signature
      ),

    declaration_variant_getter_signature: $ =>
      seq(
        optional_with_placeholder(
          'modifier_list',
          optional($.external_builtin),
          optional($.static_modifier)
        ),
        $.getter_signature
      ),

    declaration_variant_setter_signature: $ =>
      seq(
        optional_with_placeholder('modifier_list', $.external_and_static_),
        $.setter_signature
      ),

    declaration_variant_operator_signature: $ =>
      seq(
        optional_with_placeholder('modifier_list', $.external_),
        $.operator_signature
      ),

    declaration_variant_function_signature: $ =>
      seq(
        optional_with_placeholder(
          'modifier_list',
          choice($.external_and_static_, $.static_modifier)
        ),
        $.function_signature
      ),
    declaration_variant_static_final_declaration_list: $ =>
      seq(
        optional_with_placeholder(
          'modifier_list',
          seq($.static_modifier, $._final_or_const)
        ),
        optional_with_placeholder('type_optional', $.type),
        $.static_final_declaration_list
      ),

    declaration_variant_initialized_identifier_list: $ =>
      seq(
        optional_with_placeholder(
          'modifier_list',
          seq(
            optional($._static_or_covariant),
            optional($.late_builtin),
            optional($.final_builtin)
          )
        ),
        optional_with_placeholder(
          'type_optional',
          choice($.type, $.inferred_type)
        ),
        $.initialized_identifier_list
      ),

    declaration: $ =>
      choice(
        seq(
          $.constant_constructor_signature,
          optional(choice($.redirection, $.initializers))
        ),
        seq(
          $.constructor_signature,
          optional(choice($.redirection, $.initializers))
        ),
        $.declaration_variant_factory_constructor_signature,
        $.redirecting_factory_constructor_signature,
        $.declaration_variant_constructor_signature,
        $.declaration_variant_getter_signature,
        $.declaration_variant_setter_signature,
        $.declaration_variant_operator_signature,
        $.declaration_variant_function_signature,
        $.declaration_variant_static_final_declaration_list,
        $.declaration_variant_initialized_identifier_list
        //    TODO: add in the 'late' keyword from the informal draft spec:
        //    |static late final〈type〉?〈initializedIdentifierList〉
        //    |static late?〈varOrType〉 〈initializedIdentifierList〉
        //    |covariant late?〈varOrType〉 〈initializedIdentifierList〉
        //    |late?final〈type〉?〈initializedIdentifierList〉
        //    |late?〈varOrType〉 〈initializedIdentifierList〉
      ),

    initialized_identifier_list: $ => commaSep1($.initialized_identifier),
    initialized_identifier: $ => field('assignment', $.initialized_identifier_),

    initialized_identifier_: $ =>
      seq(
        field('assignment_variable', $.identifier),
        optional_with_placeholder(
          'assignment_value_list_optional',
          seq('=', alias($.expression_, $.assignment_variable))
        )
      ),

    static_final_declaration_list: $ => commaSep1($.static_final_declaration),
    binary_operator: $ =>
      choice(
        $.multiplicative_operator,
        $.additive_operator,
        $.shift_operator,
        $.relational_operator,
        '==',
        $.bitwise_operator
      ),
    operator_signature: $ =>
      seq(
        optional($.type),
        $._operator,
        choice('~', $.binary_operator, '[]', '[]='),
        $.formal_parameter_list,
        optional($._native)
      ),
    static_final_declaration: $ => seq($.identifier, '=', $.expression_),

    external_and_static_: $ => seq($.external_, optional($.static_modifier)),
    _static_or_covariant: $ => choice($.covariant_modifier, $.static_modifier),
    _final_or_const: $ => choice($.final_builtin, $.const_builtin),

    static_initializer: $ => seq($.static_modifier, $.enclosed_body),

    initializers: $ => seq(':', commaSep1($.initializer_list_entry)),
    initializer_list_entry: $ =>
      choice(
        seq(
          'super',
          optional(seq('.', $.qualified)),
          //$.arguements
          $.arguments
        ),
        seq(
          'super',
          //$.arguements
          $.arguments
        ),
        $.field_initializer,
        $.assertion
      ),

    field_initializer: $ =>
      seq(
        optional(seq($.this, '.')),
        $.identifier,
        '=',
        // $.conditional_expression,
        $._real_expression,
        repeat($.cascade_section)
      ),

    // constructor_signature: $ => seq(
    //      $._constructor_declarator,
    //      // optional($.throws),
    //      // field('body', choice(
    //      //     $.constructor_body,
    //      //     $._semicolon
    //      // ))
    //  ),

    factory_constructor_signature: $ =>
      seq($.factory_modifier, sep1($.identifier, '.'), $.formal_parameter_list),

    redirecting_factory_constructor_signature: $ =>
      seq(
        optional($.const_builtin),
        $.factory_modifier,
        sep1($.identifier, '.'),
        $.formal_parameter_list,
        '=',
        $.type_not_void,
        optional(seq('.', $.identifier))
      ),

    redirection: $ =>
      seq(':', $.this, optional(seq('.', $.identifier)), $.arguments),

    constructor_signature: $ =>
      seq(
        field('name', seq($.identifier, optional(seq('.', $.identifier)))),
        field('parameters', $.formal_parameter_list)
      ),
    constant_constructor_signature: $ =>
      seq(
        field('modifier_list', seq(optional($.external_), $.const_builtin)),
        $.qualified,
        $.formal_parameter_list
      ),

    constructor_body: $ =>
      seq(
        '{',
        optional($.explicit_constructor_invocation),
        repeat($.statement),
        '}'
      ),

    explicit_constructor_invocation: $ =>
      seq(
        choice(
          seq(optional($.type_arguments), choice($.this, $.super)),
          seq(
            field('object', choice($._ambiguous_name, $._primary)),
            '.',
            optional($.type_arguments),
            $.super
          )
        ),
        field('arguments', $.arguments),
        $._semicolon
      ),

    _ambiguous_name: $ => choice($.identifier, $.scoped_identifier),

    scoped_identifier: $ =>
      seq(
        field('scope', choice($.identifier, $.scoped_identifier)),
        '.',
        field('name', $.identifier)
      ),

    variable_declaration: $ =>
      seq($.declared_identifier, optional(seq(',', commaSep1($.identifier)))),

    initialized_variable_definition: $ =>
      field(
        'assignment_list',
        seq(
          alias($.first_initialized_variable, $.assignment),
          // $.declared_identifier,
          // optional_with_placeholder(
          //     'assignment_value',
          //     seq(
          //         prec(DART_PREC.BUILTIN, '='),
          //         field('value', $.expression_)
          //     )
          // ),
          repeat(seq(',', $.initialized_identifier))
        )
      ),

    first_initialized_variable: $ =>
      seq(
        $.declared_identifier,
        optional_with_placeholder(
          'assignment_value_list_optional',
          seq(
            prec(DART_PREC.BUILTIN, '='),
            alias($.expression_, $.assignment_value)
          )
        )
      ),

    // initialized_identifier: $ => seq(
    //   $.identifier,
    //   optional(seq('=', $.expression_))
    // ),

    declared_identifier: $ =>
      seq(
        optional_with_placeholder('decorator_list', $.metadata_),
        optional_with_placeholder('modifier_list', $.covariant_modifier),
        field('type_optional', alias($.final_const_var_or_type, $.type)),
        field('assignment_variable', $.identifier)
      ),

    // Types

    final_const_var_or_type: $ =>
      choice(
        seq(optional($.late_builtin), $.final_builtin, optional($.type)),
        seq($.const_builtin, optional($.type)),
        seq(optional($.late_builtin), choice($.inferred_type, $.type))
      ),

    type: $ =>
      choice(
        seq($.function_type, optional($._nullable_type)),
        $._type_not_function
        // $._function_type_tails,
        // seq(
        //     $._type_not_function,
        //     $._function_type_tails
        // ),
        // $._type_not_function
        // $._unannotated_type,
        // $.annotated_type
      ),
    _type_not_function: $ => choice($._type_not_void_not_function, $.void_type),
    _type_not_void_not_function: $ =>
      choice(
        seq(
          $._type_name,
          optional($.type_arguments),
          optional($._nullable_type)
        ),
        // rewritten in accordance with the draft spec page 198
        seq($._function_builtin_identifier, optional($._nullable_type))
      ),

    function_type: $ =>
      choice(
        $._function_type_tails,
        seq($._type_not_function, $._function_type_tails)
      ),
    _function_type_tails: $ => repeat1($._function_type_tail),

    _function_type_tail: $ =>
      seq(
        $._function_builtin_identifier,
        optional($.type_parameter_list),
        optional($._nullable_type),
        optional($.parameter_type_list),
        optional($._nullable_type)
      ),

    parameter_type_list: $ =>
      seq(
        '(',
        optional(
          choice(
            commaSep1TrailingComma($.normal_parameter_type),
            seq(
              commaSep1($.normal_parameter_type),
              ',',
              $.optional_parameter_types
            ),
            $.optional_parameter_types
          )
        ),
        ')'
      ),

    normal_parameter_type: $ => choice($.typed_identifier, $.type),

    optional_parameter_types: $ =>
      choice($.optional_positional_parameter_types, $.named_parameter_types),

    optional_positional_parameter_types: $ =>
      seq('[', commaSep1TrailingComma($.normal_parameter_type), ']'),
    named_parameter_types: $ =>
      seq('{', commaSep1TrailingComma($.typed_identifier), '}'),

    type_not_void: $ =>
      choice(
        seq($.function_type, optional($._nullable_type)),
        // $.function_type,
        $._type_not_void_not_function
        // alias($.identifier, $.type_identifier),
        // // $.scoped_type_identifier,
        // $.generic_type
      ),

    type_not_void_list: $ => commaSep1($.type_not_void),

    _type_name: $ =>
      seq(
        alias($.identifier, $.type_identifier),
        optional($.type_dot_identifier_)
        // optional($._nullable_type),
      ),

    // _type_name: $ => prec.right( // changed from above?
    //     seq(
    //         alias(
    //             $.identifier,
    //             $.type_identifier
    //         ),
    //         optional(
    //             $.type_dot_identifier_
    //         ),
    //         optional($._nullable_type),
    //     )
    // ),

    type_dot_identifier_: $ =>
      prec.right(
        DART_PREC.IMPORT_EXPORT,
        seq('.', alias($.identifier, $.type_identifier))
      ),

    typed_identifier: $ => seq(optional($.metadata_), $.type, $.identifier),

    _nullable_type: $ => prec(DART_PREC.BUILTIN, '?'),

    floating_point_type: $ => token('double'),

    boolean_type: $ => prec(DART_PREC.BUILTIN, 'bool'),

    void_type: $ => token('void'),

    inferred_type: $ => prec(DART_PREC.BUILTIN, 'var'),

    _method_header: $ =>
      seq(
        optional(
          seq(
            field('type_parameter_list', $.type_parameter_list),
            optional($.metadata_)
          )
        ),
        field('type', $.type),
        $._method_declarator,
        optional($.throws)
      ),

    _method_declarator: $ =>
      seq(
        field('name', $.identifier),
        field('parameters', $.formal_parameter_list),
        optional($.dimensions)
      ),

    function_non_arrow_variant: $ =>
      seq(
        optional_with_placeholder('modifier_list', $.async_modifier_choice),
        $.enclosed_body
      ),
    function_arrow_variant: $ =>
      seq(
        optional_with_placeholder('modifier_list', $.async_modifier),
        '=>',
        $.expression_,
        $._semicolon
      ),

    function_body: $ =>
      choice($.function_arrow_variant, $.function_non_arrow_variant),
    function_expression_body: $ =>
      choice(
        seq(
          optional_with_placeholder('modifier_list', $.async_modifier),
          '=>',
          $.expression_
        ),
        $.function_non_arrow_variant
      ),
    function_signature: $ =>
      seq(
        // optional($.metadata_),
        optional($.type),
        field('identifier', choice($._get, $._set, $.identifier)),
        $._formal_parameter_part,
        optional($._native)
      ),

    // _get_identifier: $ => alias(
    //         $.identifier, // this way the syntax still highlights consistently.
    //         $._get
    //     ),

    _formal_parameter_part: $ =>
      seq(optional($.type_parameter_list), $.formal_parameter_list),

    formal_parameter_list: $ => $._strict_formal_parameter_list,

    _strict_formal_parameter_list: $ =>
      seq(
        '(',
        optional_with_placeholder(
          'parameter_list',
          seq($.normal_formal_parameters, optional(','))
        ),
        optional_with_placeholder(
          'named_parameter_list_optional',
          $.named_formal_parameters
        ),
        optional_with_placeholder(
          'positional_parameter_list_optional',
          $.optional_postional_formal_parameters
        ),
        ')'
      ),

    normal_formal_parameters: $ => commaSep1($.formal_parameter),

    positional_parameters: $ =>
      seq(
        '[',
        field(
          'positional_parameter_list',
          commaSep1(alias($.default_formal_parameter, $.positional_parameter))
        ),
        ']'
      ),
    optional_postional_formal_parameters: $ =>
      seq(
        '[',
        field(
          'positional_parameter_list',
          commaSep1TrailingComma(
            alias($.default_formal_parameter, $.positional_parameter)
          )
        ),
        ']'
      ),
    named_formal_parameters: $ =>
      seq(
        '{',
        field(
          'named_parameter_list',
          commaSep1TrailingComma(
            alias($.default_named_parameter, $.named_parameter)
          )
        ),
        '}'
      ),

    formal_parameter: $ => field('parameter', $.normal_formal_parameter),

    default_formal_parameter: $ =>
      seq($.formal_parameter, optional(seq('=', $.expression_))),
    default_named_parameter: $ =>
      seq(
        optional_with_placeholder('modifier_list', $.required_modifier),
        $.formal_parameter,
        optional(seq(choice('=', ':'), $.expression_))
      ),
    // choice(
    //     seq(
    //         optional(
    //             'required'
    //         ),
    //         $.formal_parameter,
    //         optional(
    //             seq(
    //                 '=',
    //                 $.expression_
    //             )
    //         )
    //     ),
    //     seq(
    //         optional(
    //             'required'
    //         ),
    //         $.formal_parameter,
    //         optional(
    //             seq(
    //                 ':',
    //                 $.expression_
    //             )
    //         )
    //     )
    // ),

    normal_formal_parameter: $ =>
      seq(
        optional_with_placeholder('decorator_list', $.metadata_),
        choice(
          $.function_formal_parameter,
          $.simple_formal_parameter,
          $.constructor_param
          // $.field_formal_parameter
        )
      ),

    function_formal_parameter: $ =>
      seq(
        optional_with_placeholder('modifier_list', $.covariant_modifier),
        optional_with_placeholder('type_optional', $.type),
        $.identifier,
        $._formal_parameter_part,
        optional($._nullable_type)
      ),

    simple_formal_parameter: $ =>
      choice(
        $.declared_identifier,
        seq(
          optional_with_placeholder('modifier_list', $.covariant_modifier),
          $.identifier
        )
      ),
    //constructor param = field formal parameter
    constructor_param: $ =>
      field(
        'identifier',
        seq(
          optional($.final_const_var_or_type),
          $.this,
          '.',
          $.identifier,
          optional($._formal_parameter_part)
        )
      ),

    receiver_parameter: $ =>
      seq(
        optional($.metadata_),
        $.type,
        optional(seq($.identifier, '.')),
        $.this
      ),

    spread_parameter: $ =>
      seq(optional($.metadata_), $.type, '...', $.declared_identifier),

    throws: $ => seq('throws', commaSep1($.type)),

    local_variable_declaration: $ =>
      seq($.initialized_variable_definition, $._semicolon),

    script_tag: $ => seq('#!', /.+/, '\n'),

    library_name: $ =>
      seq(
        optional($.metadata_),
        'library',
        $.dotted_identifier_list,
        $._semicolon
      ),

    dotted_identifier_list: $ => sep1($.identifier, '.'),

    qualified: $ => seq($.identifier, optional(seq('.', $.identifier))),

    // Built in identifier tokens: These should be tokenized.
    //assert,break,case,
    // catch,
    // class,
    // const,
    // continue,
    // default,
    // do,
    // else,
    // enum,
    // extends,
    // false,
    // final,
    // finally,
    // for,
    // if,
    // in,
    // is,
    // new,
    // null,
    // rethrow,
    // return,
    // super,
    // switch,
    // this,
    // throw,
    // true,
    // try,
    // var,
    // void,
    // while,
    // with

    _as: $ => prec(DART_PREC.BUILTIN, 'as'),
    break_builtin_: $ => token('break'),
    assert_builtin_: $ => token('assert'),
    case_builtin: $ => token('case'),
    covariant_modifier: $ =>
      prec(DART_PREC.BUILTIN, field('modifier', 'covariant')),
    _deferred: $ => prec(DART_PREC.BUILTIN, 'deferred'),
    _dynamic: $ => prec(DART_PREC.BUILTIN, 'dynamic'),
    _export: $ => prec(DART_PREC.BUILTIN, 'export'),
    external_: $ => $.external_builtin,
    factory_modifier: $ =>
      prec(DART_PREC.BUILTIN, field('modifier', 'factory')),
    _function_builtin_identifier: $ => prec(DART_PREC.BUILTIN, 'Function'),
    _get: $ => prec(DART_PREC.BUILTIN, 'get'),
    _native: $ => seq('native', optional($.string_literal)),
    _implements: $ => prec(DART_PREC.BUILTIN, 'implements'),
    _import: $ => prec(DART_PREC.BUILTIN, 'import'),
    _interface: $ => prec(DART_PREC.BUILTIN, 'interface'),
    _library: $ => prec(DART_PREC.BUILTIN, 'library'),
    _operator: $ => prec(DART_PREC.BUILTIN, 'operator'),
    _mixin: $ => prec(DART_PREC.BUILTIN, 'mixin'),
    _part: $ => prec(DART_PREC.BUILTIN, 'part'),
    _set: $ => prec(DART_PREC.BUILTIN, 'set'),
    static_modifier: $ => prec(DART_PREC.BUILTIN, field('modifier', 'static')),
    _typedef: $ => prec(DART_PREC.BUILTIN, 'typedef'),
    _new_builtin: $ => prec(DART_PREC.BUILTIN, 'new'),
    const_builtin: $ => field('modifier', token('const')),
    final_builtin: $ => field('modifier', token('final')),
    late_builtin: $ => prec(DART_PREC.BUILTIN, 'late'),
    external_builtin: $ =>
      prec(DART_PREC.BUILTIN, field('modifier', 'external')),
    // _open_arrow_builtin: $ => token(
    //     '<'
    // ),
    // _close_arrow_builtin: $ => token(
    //     '>'
    // ),
    // _try: $ => prec(
    //     DART_PREC.TRY,
    //     token.immediate('try')
    // ),
    // _less_than_builtin: $ => prec( //<
    //     DART_PREC.BUILTIN,
    //     // 'external',
    //     token('<')
    // ),
    // _greater_than_builtin: $ => prec( //>
    //     DART_PREC.BUILTIN,
    //     // 'external',
    //    token('>')
    // ),
    // _equals_builtin: $ => prec( //=
    //     DART_PREC.BUILTIN,
    //     // 'external',
    //     token('=')
    // ),
    this: $ => prec(DART_PREC.BUILTIN, 'this'),

    super: $ => prec(DART_PREC.BUILTIN, 'super'),

    label: $ => seq($.identifier, ':'),

    _semicolon: $ => seq(';', optional($._automatic_semicolon)),

    identifier: $ => /[a-zA-Z_$][\w$]*/,
    identifier_dollar_escaped: $ => /([a-zA-Z_]|(\\\$))([\w]|(\\\$))*/,
    //TODO: add support for triple-slash comments as a special category.
    // Trying to add support for nested multiline comments.
    // http://stackoverflow.com/questions/13014947/regex-to-match-a-c-style-multiline-comment/36328890#36328890
    comment: $ =>
      token(
        choice(seq('//', /[^/].*/), seq('/*', /[^*]*\*+([^/*][^*]*\*+)*/, '/'))
      ),
    //added nesting comments.
    documentation_comment: $ =>
      token(
        choice(
          seq('///', /.*/)
          // seq(
          //     '/**',
          //     repeat(
          //         choice(
          //             /[^*]*\*+([^/*][^*]*\*+)*/,
          //             // $.comment
          //             // ,
          //             /.*/,
          //             $._multiline_comment,
          //             $.documentation_comment
          //         )
          //     ),
          //     '*/'
          // )
        )
      ),
    // multiline_comment: $ => seq(
    //     $._multiline_comment_begin,
    //     $._multiline_comment_core,
    //     // repeat(
    //     //     choice(
    //     //         $._multiline_comment_core,
    //     //         $.multiline_comment
    //     //     )
    //     // ),
    //     $._multiline_comment_end
    // ),
    // _multiline_comment_end: $ => token('*/'),
    // _multiline_comment_begin: $ => token('/*'),
    //
    // _nested_multiline_comment: $ => seq(
    //     $._multiline_comment_begin,
    //     repeat(
    //         choice(
    //             /([^\/*]*|\/[^*]|\*[^\/])+/,
    //             $._nested_multiline_comment
    //             // seq(
    //             //     $._multiline_comment_begin,
    //             //     $._multiline_comment_core,
    //             // )
    //         )
    //     ),
    //     $._multiline_comment_end
    // ),
    //
    // _multiline_comment_core: $ => seq(
    //     repeat1(
    //         choice(
    //             /([^\/*]*|\/[^*]|\*[^\/])+/,
    //             $._nested_multiline_comment
    //             // seq(
    //             //     $._multiline_comment_begin,
    //             //     $._multiline_comment_core,
    //             // )
    //         )
    //     ),
    //     // $._multiline_comment_end
    // ),
  },
})

function sep1(rule, separator) {
  return seq(rule, repeat(seq(separator, rule)))
}

function sep2(rule, separator) {
  return seq(rule, repeat1(seq(separator, rule)))
}

function commaSep1(rule) {
  return seq(rule, repeat(seq(',', rule)))
}

function commaSep(rule) {
  return optional(commaSep1(rule))
}

function commaSep1TrailingComma(rule) {
  return seq(rule, repeat(seq(',', rule)), optional(','))
}

function commaSepTrailingComma(rule) {
  return optional(commaSep1TrailingComma(rule))
}

function binaryRunLeft(rule, separator, superItem, precedence) {
  return prec.left(
    //left
    precedence,
    choice(
      sep2(
        // $.bitwise_xor_expression,
        rule,
        separator
      ),
      seq(
        superItem,
        repeat1(
          seq(
            separator,
            rule
            // $.bitwise_xor_expression
          )
        )
      )
    )
  )
}

function optional_with_placeholder(field_name, rule) {
  return choice(field(field_name, rule), field(field_name, blank()))
}
