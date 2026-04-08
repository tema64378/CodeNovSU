INSERT INTO tracks (slug, title, description, category, is_premium, is_published)
VALUES
    ('cpp', 'C++', 'System programming, algorithms, STL, and performance-focused engineering.', 'programming', FALSE, TRUE),
    ('python', 'Python', 'Programming fundamentals, automation, backend basics, and AI tooling.', 'programming', FALSE, TRUE),
    ('data-analysis', 'Data Analysis', 'Python, SQL, analytics thinking, and data visualization.', 'data', FALSE, TRUE),
    ('javascript', 'JavaScript', 'Frontend fundamentals, browser APIs, and interactive web applications.', 'programming', FALSE, TRUE),
    ('ai-specialist', 'AI Specialist', 'Neural networks, model usage, experimentation, and practical ML projects.', 'ai', TRUE, TRUE),
    ('cybersecurity', 'Cybersecurity for Developers', 'Secure development, threat modeling, and defensive engineering practices.', 'security', TRUE, TRUE)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    category = EXCLUDED.category,
    is_premium = EXCLUDED.is_premium,
    is_published = EXCLUDED.is_published;
