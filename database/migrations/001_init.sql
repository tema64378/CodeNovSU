CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('learner', 'premium_learner', 'moderator', 'manager', 'admin');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'access_tier') THEN
        CREATE TYPE access_tier AS ENUM ('free', 'premium', 'module_paid');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'difficulty_level') THEN
        CREATE TYPE difficulty_level AS ENUM ('beginner', 'basic', 'intermediate', 'advanced');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'task_language') THEN
        CREATE TYPE task_language AS ENUM ('python', 'cpp', 'javascript', 'html_css');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'progress_status') THEN
        CREATE TYPE progress_status AS ENUM ('locked', 'available', 'in_progress', 'completed');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'subscription_status') THEN
        CREATE TYPE subscription_status AS ENUM ('trialing', 'active', 'past_due', 'canceled', 'expired');
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    display_name VARCHAR(120) NOT NULL,
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    role user_role NOT NULL DEFAULT 'learner',
    locale VARCHAR(10) NOT NULL DEFAULT 'ru',
    avatar_config JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_settings (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    notification_email_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    notification_push_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    marketing_opt_in BOOLEAN NOT NULL DEFAULT FALSE,
    theme VARCHAR(20) NOT NULL DEFAULT 'system'
);

CREATE TABLE IF NOT EXISTS external_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL,
    provider_user_id VARCHAR(255) NOT NULL,
    access_token_encrypted VARCHAR(2048),
    refresh_token_encrypted VARCHAR(2048),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_external_accounts_provider_provider_user_id UNIQUE (provider, provider_user_id)
);

CREATE TABLE IF NOT EXISTS tracks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(80) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    category VARCHAR(80) NOT NULL,
    is_premium BOOLEAN NOT NULL DEFAULT FALSE,
    is_published BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS levels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    track_id UUID NOT NULL REFERENCES tracks(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    difficulty difficulty_level NOT NULL,
    order_index INTEGER NOT NULL,
    theme_color VARCHAR(20) NOT NULL,
    icon VARCHAR(16) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    level_id UUID NOT NULL REFERENCES levels(id) ON DELETE CASCADE,
    slug VARCHAR(120) NOT NULL,
    title VARCHAR(255) NOT NULL,
    summary TEXT NOT NULL DEFAULT '',
    theory_md TEXT NOT NULL DEFAULT '',
    estimated_minutes INTEGER NOT NULL DEFAULT 20,
    access_tier access_tier NOT NULL DEFAULT 'free',
    order_index INTEGER NOT NULL,
    is_published BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_lessons_level_slug UNIQUE (level_id, slug)
);

CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    slug VARCHAR(120) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description_md TEXT NOT NULL DEFAULT '',
    language task_language NOT NULL,
    difficulty difficulty_level NOT NULL,
    starter_code TEXT NOT NULL DEFAULT '',
    solution_template TEXT,
    max_hints INTEGER NOT NULL DEFAULT 3,
    access_tier access_tier NOT NULL DEFAULT 'free',
    estimated_minutes INTEGER NOT NULL DEFAULT 15,
    is_project_step BOOLEAN NOT NULL DEFAULT FALSE,
    is_boss BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_tasks_lesson_slug UNIQUE (lesson_id, slug)
);

CREATE TABLE IF NOT EXISTS task_test_cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    kind VARCHAR(40) NOT NULL,
    input_payload TEXT NOT NULL DEFAULT '',
    expected_output TEXT NOT NULL DEFAULT '',
    is_hidden BOOLEAN NOT NULL DEFAULT TRUE,
    weight INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS career_test_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    answers_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    recommended_track_id UUID REFERENCES tracks(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    language task_language NOT NULL,
    source_code TEXT NOT NULL,
    status VARCHAR(40) NOT NULL DEFAULT 'queued',
    score INTEGER NOT NULL DEFAULT 0,
    stdout TEXT,
    stderr TEXT,
    execution_time_ms INTEGER,
    memory_kb INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS hint_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    submission_id UUID REFERENCES submissions(id) ON DELETE SET NULL,
    level INTEGER NOT NULL,
    response_text TEXT NOT NULL,
    response_rating INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS progress_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    track_id UUID NOT NULL REFERENCES tracks(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    status progress_status NOT NULL DEFAULT 'available',
    score INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider VARCHAR(40) NOT NULL,
    plan_code VARCHAR(80) NOT NULL,
    status subscription_status NOT NULL DEFAULT 'trialing',
    starts_at TIMESTAMPTZ,
    ends_at TIMESTAMPTZ,
    auto_renew BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS entitlements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    kind VARCHAR(40) NOT NULL,
    resource_type VARCHAR(40) NOT NULL,
    resource_id UUID,
    starts_at TIMESTAMPTZ,
    ends_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_users_email ON users (email);
CREATE INDEX IF NOT EXISTS ix_external_accounts_user_id ON external_accounts (user_id);
CREATE INDEX IF NOT EXISTS ix_tracks_slug ON tracks (slug);
CREATE INDEX IF NOT EXISTS ix_levels_track_id ON levels (track_id);
CREATE INDEX IF NOT EXISTS ix_lessons_level_id ON lessons (level_id);
CREATE INDEX IF NOT EXISTS ix_tasks_lesson_id ON tasks (lesson_id);
CREATE INDEX IF NOT EXISTS ix_task_test_cases_task_id ON task_test_cases (task_id);
CREATE INDEX IF NOT EXISTS ix_career_test_attempts_user_id ON career_test_attempts (user_id);
CREATE INDEX IF NOT EXISTS ix_submissions_user_id ON submissions (user_id);
CREATE INDEX IF NOT EXISTS ix_submissions_task_id ON submissions (task_id);
CREATE INDEX IF NOT EXISTS ix_hint_requests_user_id ON hint_requests (user_id);
CREATE INDEX IF NOT EXISTS ix_hint_requests_task_id ON hint_requests (task_id);
CREATE INDEX IF NOT EXISTS ix_progress_entries_user_id ON progress_entries (user_id);
CREATE INDEX IF NOT EXISTS ix_progress_entries_track_id ON progress_entries (track_id);
CREATE INDEX IF NOT EXISTS ix_subscriptions_user_id ON subscriptions (user_id);
CREATE INDEX IF NOT EXISTS ix_entitlements_user_id ON entitlements (user_id);
