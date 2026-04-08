# CodeNovsu Technical Specification

Version: 1.0  
Date: 2026-04-08

## 1. Product Goal

Build a web platform for learning programming that combines:

- guided theory;
- practical coding tasks;
- project-based learning;
- gamification;
- personalized recommendations;
- an AI assistant that teaches without solving tasks for the user.

The platform should reduce early dropout, improve completion rates, and help learners build portfolio-ready projects.

## 2. Target Audience

- beginner programmers aged 14+;
- university students in IT-related programs;
- career switchers entering software development;
- developers upskilling in AI and cybersecurity.

## 3. User Roles

- guest: browses catalog, previews lessons, registers;
- learner: studies, solves tasks, uses AI hints, earns achievements;
- premium learner: unlocks unlimited levels, premium tracks, no ads, advanced content;
- moderator: manages forum and reported content;
- content manager: manages tracks, lessons, tasks, hints, and project modules;
- admin: full system management, monetization, users, analytics, experiments.

## 4. Core Functional Modules

### 4.1 Authentication and Profile

- email registration with verification;
- password recovery;
- login via Google and VK;
- profile editing;
- avatar customization;
- notification preferences;
- premium access status.

### 4.2 Career Guidance Test

- 5 to 7 questions with predefined answers;
- optional flow with skip support;
- automatic track recommendation;
- retake limit: once every 7 days;
- recommendation stored in profile and reused in dashboard personalization.

### 4.3 Learning Tracks

Primary tracks:

- C++;
- Python;
- Data Analysis;
- JavaScript.

Specialized tracks:

- AI Specialist;
- Cybersecurity for Developers.

Each track contains:

- levels by difficulty;
- lessons with theory;
- practice tasks;
- tests;
- bosses or milestone challenges;
- project modules.

### 4.4 Lesson and Task System

- lesson page with theory, goals, and glossary;
- task page with statement, hints, tests, and result feedback;
- support for free and premium visibility;
- support for task metadata: language, difficulty, tags, estimated duration;
- solution drafts saved automatically;
- submission history per task.

### 4.5 In-Browser Code Editor

- syntax highlighting;
- starter code and templates;
- autosave;
- solution submission;
- auto-check and hidden tests;
- detailed feedback for compilation, runtime, and logical errors;
- support for Python, C++, JavaScript, HTML/CSS in MVP-ready architecture.

### 4.6 AI Assistant

- real-time code analysis;
- syntax hints;
- concept explanations;
- anti-spoiler behavior;
- maximum 3 hints per task by default;
- hint levels:
  - level 1: directional hint;
  - level 2: structural hint;
  - level 3: partial code fragment without a full answer;
- personalization based on solution history and weak areas.

### 4.7 Gamified Progress Map

- track visualization as an RPG-style map with islands;
- lessons as map nodes;
- passed lessons marked as completed;
- current lesson highlighted;
- bosses at the end of difficulty zones;
- reward chests;
- NPC hints and guidance;
- canvas-based map rendering in the initial design.

### 4.8 Achievements

- progress-based achievements;
- streak achievements;
- speed achievements;
- social/help achievements;
- hidden achievements;
- reward redemption for hint credits, avatar cosmetics, or subscription discounts.

### 4.9 Project Portfolio

- automatic portfolio entry after project completion;
- project metadata: title, description, date, score, code snapshot, public link;
- export to PDF;
- public or private visibility setting.

### 4.10 Community and Social Features

- forum for task discussion;
- notifications for events, lessons, achievements, and reminders;
- referral program with reward logic;
- future support for peer help and mentor interactions.

### 4.11 Monetization

Free:

- all lesson theory;
- limited daily level access;
- limited AI hints.

Ad-supported active mode:

- extra daily levels unlocked through ad views.

Premium:

- unlimited levels;
- no ads;
- premium tracks and advanced content;
- unlimited or expanded AI hint access;
- exclusive materials and dashboards.

Additional monetization:

- one-time module purchases;
- voluntary donations.

## 5. Non-Functional Requirements

- API latency: up to 200 ms for 95 percent of standard requests excluding code execution;
- availability target: 99.9 percent;
- secure transport over HTTPS only;
- protection against XSS, CSRF, SSRF, brute force, and insecure code execution;
- accessibility aligned with WCAG 2.1 AA;
- Russian localization first, English-ready architecture;
- modular architecture for adding new tracks and monetization rules.

## 6. Security Requirements

- JWT access tokens with rotation or short-lived sessions;
- secure password hashing;
- OAuth 2.0 integration;
- email verification;
- RBAC for learner, moderator, manager, admin;
- sandboxed code execution through isolated containers;
- audit logs for admin actions;
- payment processing via PCI DSS-compliant providers only;
- rate limits on auth, AI, and code execution endpoints.

## 7. Analytics and AI Quality

- event tracking for onboarding, lesson progress, drop-off, hint usage, and premium conversion;
- AI interaction logging with privacy controls;
- caching for repeated LLM prompts;
- A/B testing for hint quality and conversion;
- target metrics:
  - AI hint accuracy at or above 90 percent;
  - AI feedback relevance at or above 85 percent.

## 8. Content Access Rules

- every content unit must have an access tier: free, premium, paid-module;
- free users can see premium items in the catalog but not open gated content;
- theory previews should be available before paywall walls;
- AI limits depend on plan and task type;
- ads must never block essential free learning flow.

## 9. Constraints and Assumptions

- the current repository contains a static prototype, not a production architecture;
- the first delivery should focus on a stable MVP before advanced community features;
- cybersecurity content must stay within safe and educational boundaries;
- unsafe exploit content must be isolated, moderated, or excluded from public free access.

## 10. Acceptance Criteria for MVP

- a new user can register, take the guidance test, and receive a recommended track;
- the user can open a lesson, read theory, solve a task, and receive feedback;
- the user can request AI hints without receiving a full final solution;
- progress is tracked across lessons and shown in a dashboard;
- at least one track includes 10 working tasks;
- premium-gated content is visibly separated and enforced;
- admin can manage core content entities through API or admin workflow.
