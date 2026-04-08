# CodeNovsu Roadmap

## Phase 0. Foundation and Alignment

Outcome:

- approved product scope;
- approved target stack;
- information architecture;
- clickable prototypes and engineering plan.

Deliverables:

- technical specification;
- architecture;
- data model;
- component and screen map;
- backlog for MVP.

## Phase 1. MVP

Goal:

Ship the first usable learning flow for new users.

Scope:

- authentication and user profile;
- onboarding and career guidance test;
- one track with 10 practical tasks;
- lesson and task pages;
- code editor integration;
- submission and auto-check pipeline;
- AI assistant with 3 hint levels and quota limits;
- progress tracking and basic dashboard;
- premium content flags and paywall states;
- basic admin content management through API or seed data.

Success metrics:

- learner can complete the onboarding-to-task flow end to end;
- AI hint flow works with quota enforcement;
- premium gating is enforced consistently;
- first users finish at least one lesson path without manual support.

## Phase 2. Core Expansion

Goal:

Expand educational breadth and stabilize the content system.

Scope:

- tracks for C++, Python, Data Analysis, and JavaScript;
- structured tests inside lessons;
- improved task evaluation and feedback;
- achievements v1;
- simplified portfolio generation;
- notification system;
- content management tooling.

## Phase 3. Premium and Personalization

Goal:

Turn the platform into a sustainable product with adaptive learning.

Scope:

- subscription billing;
- one-time module purchases;
- ad-rewarded extra access;
- personalized recommendations;
- adaptive difficulty logic;
- premium dashboard;
- AI quality tracking and experiments.

## Phase 4. Gamification and Projects

Goal:

Deliver the distinct product identity of CodeNovsu.

Scope:

- RPG progress map;
- bosses, chests, NPCs;
- avatar customization;
- project chains per track;
- richer portfolio pages and exports.

## Phase 5. Community and Ecosystem

Goal:

Increase retention, social learning, and external value.

Scope:

- forums and moderation;
- referral program;
- external integrations: GitHub, Kaggle, hackathon feeds;
- mentor and peer support foundations.

## Phase 6. Scale and Optimization

Goal:

Prepare for broader release and operational efficiency.

Scope:

- observability dashboards;
- advanced anti-abuse controls;
- performance tuning;
- recommendation model improvements;
- localization readiness for English;
- monetization optimization through analytics.

## Suggested Delivery Order in This Repository

1. Preserve `frontend/prototype/web` as the reference prototype.
2. Build the production app in `frontend`.
3. Build the API in `backend/api`.
4. Add migrations and seeds in `database`.
5. Migrate prototype content into structured track, lesson, and task entities.

## Immediate Engineering Tasks

1. Scaffold `frontend` with Next.js and TypeScript.
2. Scaffold `backend` with FastAPI and domain modules.
3. Create initial PostgreSQL schema for users, tracks, lessons, tasks, submissions, and entitlements.
4. Implement auth, profile, and career test APIs.
5. Implement the first full track and editor workflow.
