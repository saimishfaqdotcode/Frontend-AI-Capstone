# Front-End AI Capstone

## Overview

This repository contains my work for the FlyRank Front-End AI Engineering Internship.

The project focuses on building modern frontend applications with AI-assisted development practices, structured AI interactions, and production-ready workflows.

## Tech Stack

* Next.js
* React
* JavaScript
* AI SDK
* Zod
* OpenRouter
* Git
* GitHub

## Goals

* Learn AI-assisted frontend development
* Build professional frontend applications
* Integrate AI functionality into web applications
* Follow software engineering best practices
* Practice production-oriented development and deployment workflows

## Project Structure

```text
Frontend AI Capstone/
├── frontend/
│   ├── app/
│   │   ├── api/
│   │   │   └── chat/
│   │   │       └── route.js
│   │   ├── about/
│   │   ├── contact/
│   │   ├── projects/
│   │   └── page.jsx
│   ├── components/
│   │   └── Chat.jsx
│   ├── lib/
│   │   └── tools/
│   │       └── analyzeWebsite.js
│   ├── package.json
│   └── package-lock.json
├── README.md
├── LICENSE
├── .gitignore
├── CLAUDE.md
└── WORKFLOW.md
```

## Project Status

The repository contains the ongoing work for the FlyRank Front-End AI Engineering Internship.

The current implementation includes an AI-powered chat interface and the FE-07 server-side website analysis tool.

## FE-07 — Tool Results and Structured Output

### Website Analysis Tool

FE-07 adds a server-side tool to the AI chat route that analyzes a website URL and returns structured metadata.

### Tool Name

`analyzeWebsite`

### Purpose

The tool fetches a website URL and extracts basic page metadata, including:

* Page title
* Meta description
* Whether a title was found
* Whether a meta description was found
* Analysis timestamp

### Input Schema

The tool uses a Zod schema to validate the input.

```text
{
  url: string
}
```

The `url` field must contain a valid URL.

### Return Shape

```text
{
  url: string,
  title: string,
  description: string,
  titleFound: boolean,
  descriptionFound: boolean,
  analyzedAt: string
}
```

### Tool Definition

The server-side tool is defined in:

`frontend/lib/tools/analyzeWebsite.js`

### AI Route

The tool is registered in:

`frontend/app/api/chat/route.js`

The AI assistant can call the `analyzeWebsite` tool when the user asks for a website analysis.

### Tool Result UI

The structured tool result is rendered as a dedicated website analysis component instead of being displayed as raw JSON.

The UI displays:

* Website URL
* Page title
* Meta description
* Title status
* Description status
* Analysis timestamp

### Error Handling

Failed website analysis requests are handled with a dedicated error state in the chat interface rather than causing the application to crash.

## Build Verification

The project has been verified with the Next.js production build command:

```bash
npm run build
```

The production build completes successfully.

## Author

Saim Ishfaq

## FE-AA1 — Button Motion & State Micro-interactions

The smart button uses short transitions for immediate UI feedback while avoiding abrupt state changes.

- Hover/active interactions use a fast `180ms` ease transition.
- State/background changes use around `220ms` ease transitions.
- Loading uses a `700ms` spinner animation.
- Error feedback uses a single `300ms` shake.
- Motion is limited to compositor-friendly properties such as `transform` and `opacity`.
- `prefers-reduced-motion: reduce` disables decorative motion while keeping all state and interaction feedback visible.