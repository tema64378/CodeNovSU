# CodeNovsu

CodeNovsu is an educational web platform for learning programming through practice, project work, gamification, and an AI assistant. The product is aimed at beginners, students, career switchers, and developers expanding into AI and cybersecurity.

This repository currently contains:

- a static web prototype in `frontend/prototype/web`;
- initial curriculum notes in `docs/curriculum`;
- a production backend API foundation in `backend/api`;
- database migrations and seed files in `database`.

The project is now aligned around the updated product vision described in the technical specification dated April 8, 2026.

## Product Focus

CodeNovsu combines:

- programming tracks in C++, Python, Data Analysis, and JavaScript;
- specialized tracks in AI and cybersecurity;
- an in-browser coding experience with automated feedback;
- an AI assistant with anti-spoiler hint levels;
- a gamified progress map with bosses, rewards, NPCs, and achievements;
- a monetization model with free, ad-supported, and premium access.

## Recommended Target Architecture

For the next implementation stage, the recommended stack is:

- frontend: React + Next.js + TypeScript;
- backend API: FastAPI + Python;
- database: PostgreSQL;
- cache and async jobs: Redis;
- code execution sandbox: isolated Docker workers;
- authentication: email/password + OAuth providers (Google, VK);
- payments: Stripe and YooKassa;
- AI integration: OpenAI-compatible API with caching and observability.

This choice keeps the UI flexible while making AI, analytics, and code execution easier to evolve.

## Repository Map

- `frontend/prototype/web` — current static prototype and content pages
- `frontend` — frontend workspace for the future production client
- `backend/api` — FastAPI application for the production backend
- `database` — planned database migrations and seed data
- `archive/legacy` — archived legacy experiments and build leftovers kept out of the main flow
- `docs/technical-spec.md` — structured product specification
- `docs/architecture.md` — target system architecture
- `docs/data-model.md` — domain entities and database model
- `docs/repository-structure.md` — repository layout and folder ownership
- `docs/roadmap.md` — delivery phases from prototype to release

## MVP Scope

The first production MVP should include:

- onboarding and profile creation;
- the career guidance test;
- one free learning track with 10 practical tasks;
- lesson pages with theory, tasks, and tests;
- a web code editor with solution storage and auto-check hooks;
- AI assistant with up to 3 hints per task;
- progress tracking and a simplified map view;
- basic achievements;
- premium access flags and content gating.

## Current Status

The repository is still in a pre-production state:

- the static marketing and course prototype exists;
- the backend API foundation has been scaffolded;
- the production frontend application has not yet been implemented;
- the updated architecture, roadmap, and data model are now documented to guide development.

## Next Steps

1. Approve the target stack and product boundaries.
2. Scaffold the production frontend application in `frontend`.
3. Extend the backend API and database schema in `backend/api` and `database`.
4. Port the static prototype from `frontend/prototype/web` into reusable application screens.
5. Implement the MVP flow end to end before expanding premium and social features.
