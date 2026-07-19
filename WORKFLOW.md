# AI Workflow Comparison

This exercise compared two different approaches to building the same React settings form using AI assistance.

## Round 1 – Vague Prompt

For the first version, I used a very short and general prompt asking the AI to create a settings form. The generated code produced a working user interface, but it lacked several important features. Form validation was incomplete, accessibility considerations were limited, and there was no clear verification step. The code required additional review to identify missing requirements and confirm that the form behaved correctly.

One issue I noticed was that some expected validation behavior was either missing or inconsistent. This required manual checking before the feature could be considered complete.

## Round 2 – Precise Prompt

For the second version, I started with a fresh AI session and used a detailed prompt. The prompt included the project structure, file locations, functional requirements, validation rules, accessibility requirements, coding constraints, and a verification step. This produced a more complete implementation.

The improved version included controlled inputs, proper validation, disabled submission until the form became valid, accessible labels and ARIA attributes, and a success message after saving. The code required fewer manual corrections because the requirements were clearly defined.

## Comparison

Although writing the detailed prompt took longer, it reduced the overall development time because fewer fixes were needed afterward. The code was easier to review, more accurate, and closer to the required functionality on the first attempt.

This exercise showed that the quality of AI-generated code depends heavily on the quality of the prompt. Providing clear requirements, constraints, and verification steps produces more reliable results and reduces review effort.