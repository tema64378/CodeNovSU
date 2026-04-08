# CodeNovsu Data Model

## 1. Core Entities

### User

- `id`
- `email`
- `password_hash`
- `email_verified_at`
- `display_name`
- `avatar_config`
- `role`
- `locale`
- `created_at`
- `updated_at`

### UserSettings

- `user_id`
- `notification_email_enabled`
- `notification_push_enabled`
- `marketing_opt_in`
- `theme`

### ExternalAccount

- `id`
- `user_id`
- `provider`
- `provider_user_id`
- `access_token_encrypted`
- `refresh_token_encrypted`

### CareerTestAttempt

- `id`
- `user_id`
- `started_at`
- `completed_at`
- `answers_json`
- `recommended_track_id`

### Track

- `id`
- `slug`
- `title`
- `description`
- `category`
- `is_premium`
- `is_published`

### Level

- `id`
- `track_id`
- `title`
- `difficulty`
- `order_index`
- `theme_color`
- `icon`

### Lesson

- `id`
- `level_id`
- `slug`
- `title`
- `summary`
- `theory_md`
- `estimated_minutes`
- `access_tier`
- `order_index`
- `is_published`

### Task

- `id`
- `lesson_id`
- `slug`
- `title`
- `description_md`
- `language`
- `difficulty`
- `starter_code`
- `solution_template`
- `max_hints`
- `access_tier`
- `estimated_minutes`
- `is_project_step`
- `is_boss`

### TaskTestCase

- `id`
- `task_id`
- `kind`
- `input_payload`
- `expected_output`
- `is_hidden`
- `weight`

### Submission

- `id`
- `user_id`
- `task_id`
- `language`
- `source_code`
- `status`
- `score`
- `stdout`
- `stderr`
- `execution_time_ms`
- `memory_kb`
- `created_at`

### HintRequest

- `id`
- `user_id`
- `task_id`
- `submission_id`
- `level`
- `response_text`
- `response_rating`
- `created_at`

### ProgressEntry

- `id`
- `user_id`
- `track_id`
- `lesson_id`
- `task_id`
- `status`
- `score`
- `completed_at`

### Achievement

- `id`
- `slug`
- `title`
- `description`
- `reward_type`
- `reward_value`
- `is_hidden`

### UserAchievement

- `id`
- `user_id`
- `achievement_id`
- `earned_at`

### RewardChest

- `id`
- `level_id`
- `title`
- `reward_type`
- `reward_value`
- `rarity`

### PortfolioProject

- `id`
- `user_id`
- `track_id`
- `title`
- `description`
- `code_snapshot`
- `score`
- `share_slug`
- `visibility`
- `completed_at`

### ForumThread

- `id`
- `author_id`
- `track_id`
- `task_id`
- `title`
- `body_md`
- `status`
- `created_at`

### ForumComment

- `id`
- `thread_id`
- `author_id`
- `body_md`
- `created_at`

### Notification

- `id`
- `user_id`
- `type`
- `title`
- `body`
- `read_at`
- `created_at`

### Subscription

- `id`
- `user_id`
- `provider`
- `plan_code`
- `status`
- `starts_at`
- `ends_at`
- `auto_renew`

### Purchase

- `id`
- `user_id`
- `provider`
- `product_type`
- `product_ref`
- `amount`
- `currency`
- `status`
- `paid_at`

### Entitlement

- `id`
- `user_id`
- `kind`
- `resource_type`
- `resource_id`
- `starts_at`
- `ends_at`

### AdRewardEvent

- `id`
- `user_id`
- `campaign_type`
- `reward_type`
- `reward_value`
- `created_at`

### AuditLog

- `id`
- `actor_user_id`
- `action`
- `entity_type`
- `entity_id`
- `payload_json`
- `created_at`

## 2. Key Relationships

- one `User` has many `ExternalAccount`
- one `User` has many `CareerTestAttempt`
- one `Track` has many `Level`
- one `Level` has many `Lesson`
- one `Lesson` has many `Task`
- one `Task` has many `TaskTestCase`
- one `User` has many `Submission`
- one `Submission` may have many `HintRequest`
- one `User` has many `ProgressEntry`
- one `User` has many `UserAchievement`
- one `User` has many `PortfolioProject`
- one `User` has many `Notification`
- one `User` has many `Subscription`, `Purchase`, and `Entitlement`

## 3. Access Control Concepts

Use enum-like values:

- `role`: learner, premium_learner, moderator, manager, admin
- `access_tier`: free, premium, module_paid
- `status`: draft, published, archived, pending, passed, failed

## 4. MVP Tables to Build First

For MVP, prioritize:

- `users`
- `external_accounts`
- `career_test_attempts`
- `tracks`
- `levels`
- `lessons`
- `tasks`
- `task_test_cases`
- `submissions`
- `hint_requests`
- `progress_entries`
- `subscriptions`
- `entitlements`

Add forums, ad rewards, reward chests, and advanced portfolio exports in later phases.
