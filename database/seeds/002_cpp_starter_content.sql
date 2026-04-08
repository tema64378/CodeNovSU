WITH cpp_track AS (
    SELECT id
    FROM tracks
    WHERE slug = 'cpp'
),
inserted_level AS (
    INSERT INTO levels (track_id, title, difficulty, order_index, theme_color, icon)
    SELECT
        cpp_track.id,
        'Beginner Island',
        'beginner',
        1,
        '#4CAF50',
        '🌱'
    FROM cpp_track
    WHERE NOT EXISTS (
        SELECT 1
        FROM levels
        WHERE track_id = cpp_track.id
          AND order_index = 1
    )
    RETURNING id
),
level_ref AS (
    SELECT id FROM inserted_level
    UNION ALL
    SELECT id
    FROM levels
    WHERE track_id = (SELECT id FROM cpp_track)
      AND order_index = 1
    LIMIT 1
),
inserted_lesson AS (
    INSERT INTO lessons (level_id, slug, title, summary, theory_md, estimated_minutes, access_tier, order_index, is_published)
    SELECT
        level_ref.id,
        'hello-world-and-structure',
        'Hello, World! и структура программы',
        'Первый урок знакомит с точкой входа, директивами и базовой структурой C++ программы.',
        '# Hello, World!\n\nВ этом уроке студент знакомится со структурой простой программы на C++: `#include`, `main`, вывод текста и возврат кода завершения.',
        15,
        'free',
        1,
        TRUE
    FROM level_ref
    WHERE NOT EXISTS (
        SELECT 1
        FROM lessons
        WHERE level_id = level_ref.id
          AND slug = 'hello-world-and-structure'
    )
    RETURNING id
),
lesson_ref AS (
    SELECT id FROM inserted_lesson
    UNION ALL
    SELECT id
    FROM lessons
    WHERE level_id = (SELECT id FROM level_ref LIMIT 1)
      AND slug = 'hello-world-and-structure'
    LIMIT 1
)
INSERT INTO tasks (
    lesson_id,
    slug,
    title,
    description_md,
    language,
    difficulty,
    starter_code,
    solution_template,
    max_hints,
    access_tier,
    estimated_minutes,
    is_project_step,
    is_boss
)
SELECT
    lesson_ref.id,
    'print-hello-cpp',
    'Выведи приветствие',
    'Напиши программу, которая выводит `Hello, CodeNovsu!` в консоль.',
    'cpp',
    'beginner',
    '#include <iostream>\n\nint main() {\n    // TODO: print Hello, CodeNovsu!\n    return 0;\n}\n',
    NULL,
    3,
    'free',
    10,
    FALSE,
    FALSE
FROM lesson_ref
WHERE NOT EXISTS (
    SELECT 1
    FROM tasks
    WHERE lesson_id = lesson_ref.id
      AND slug = 'print-hello-cpp'
);
