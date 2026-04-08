# CodeNovsu Architecture

## 1. Architecture Style

Recommended architecture:

- web client as a separate frontend application;
- modular backend API;
- asynchronous workers for heavy operations;
- isolated code execution service;
- shared PostgreSQL database;
- Redis for caching, rate limiting, and queues.

This gives a clean path from MVP to a larger platform without forcing microservices too early.

## 2. Target Topology

### Frontend

Recommended:

- Next.js with React and TypeScript;
- SSR and static rendering for marketing pages;
- authenticated SPA-style flows for dashboard, lessons, editor, and profile;
- canvas-based module for the RPG map.

### Backend API

Recommended modules:

- `auth` — registration, login, OAuth, email verification, sessions;
- `users` — profiles, avatars, settings, plans;
- `tracks` — tracks, levels, lessons, tasks, projects;
- `progress` — completion state, streaks, achievements, recommendations;
- `ai` — hint orchestration, guardrails, caching, experiments;
- `billing` — subscriptions, purchases, donations, entitlements;
- `community` — forum threads, comments, reports, notifications;
- `portfolio` — project artifacts, share links, exports;
- `analytics` — events and experiment reporting;
- `admin` — content management and moderation.

### Background Workers

- email sending;
- notification delivery;
- PDF export generation;
- analytics aggregation;
- AI prompt caching and summarization;
- code execution job orchestration.

### Sandbox Runner

Dedicated service for code execution:

- receives normalized execution jobs;
- runs them in short-lived containers;
- applies CPU, memory, network, and filesystem limits;
- returns stdout, stderr, exit code, and test results;
- stores execution traces for debugging and abuse review.

## 3. Recommended Runtime Split

### Frontend App

- public pages: catalog, marketing, auth entry points;
- protected pages: dashboard, lesson, task, profile, portfolio, map;
- admin area: content management and moderation.

### Backend API

- REST API for the product frontend;
- internal endpoints for workers and sandbox orchestration;
- webhook endpoints for payments, OAuth, and email callbacks.

## 4. Data Flow Examples

### Lesson Flow

1. Frontend requests lesson data.
2. API returns lesson content, access tier, progress status, and task list.
3. User opens a task and edits code in the browser.
4. Submission creates an execution job.
5. Sandbox runner executes tests and returns results.
6. API stores attempt history and updates progress.

### AI Hint Flow

1. User requests a hint.
2. API checks entitlement and hint quota.
3. API gathers task context, user history, and current code.
4. AI policy layer creates a safe prompt.
5. LLM response is post-processed to enforce anti-spoiler rules.
6. Result is logged, cached, and returned with hint level metadata.

### Premium Access Flow

1. User opens premium content.
2. API checks entitlement from subscription or module purchase.
3. If access is denied, the API returns preview-safe data and paywall metadata.
4. Frontend renders the gated state without exposing the full content payload.

## 5. Security Boundaries

### Public Zone

- marketing pages;
- registration;
- login;
- public portfolio pages.

### Authenticated Zone

- lessons, tasks, hints, dashboard, profile, achievements, map.

### Privileged Zone

- content management;
- moderation;
- analytics dashboards;
- billing administration.

### Restricted Execution Zone

- isolated workers with no direct access to main application data stores;
- no unrestricted external network access from learner code;
- execution environment reset between runs.

## 6. Storage Components

- PostgreSQL for transactional domain data;
- Redis for cache, quotas, queue state, and hot session helpers;
- object storage for avatars, exported PDFs, project assets, and large content files;
- observability sink for logs, metrics, traces, and audit events.

## 7. API Design Principles

- versioned REST API under `/api/v1`;
- clear separation between learner-facing and admin-facing resources;
- idempotent billing and webhook handlers;
- structured error responses with machine-readable codes;
- pagination for forums, attempts, notifications, and catalog data.

## 8. Suggested Repository Target Structure

```text
frontend/
  prototype/
    web/
  app/
  components/
  features/
  shared/
  public/

backend/
  api/
    app/
      api/
      domain/
      services/
      workers/
      security/
      integrations/

database/
  migrations/
  seeds/

docs/
  technical-spec.md
  architecture.md
  data-model.md
  roadmap.md
```

## 9. MVP Service Boundaries

For MVP, keep it simple:

- one frontend application;
- one main backend application;
- one sandbox runner service;
- one PostgreSQL database;
- one Redis instance.

Do not split into multiple deployable microservices until usage or team size justifies it.
