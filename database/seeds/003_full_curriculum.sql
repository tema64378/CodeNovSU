WITH level_seed (track_slug, title, difficulty, order_index, theme_color, icon) AS (
    VALUES
        ('cpp', 'Beginner Island', 'beginner', 1, '#4CAF50', '🌱'),
        ('cpp', 'Basic Bay', 'basic', 2, '#2196F3', '📘'),
        ('cpp', 'Intermediate Ridge', 'intermediate', 3, '#FF9800', '⚡'),
        ('cpp', 'Advanced Citadel', 'advanced', 4, '#9C27B0', '👑'),
        ('python', 'Beginner Island', 'beginner', 1, '#4CAF50', '🌱'),
        ('python', 'Basic Bay', 'basic', 2, '#2196F3', '📘'),
        ('python', 'Intermediate Ridge', 'intermediate', 3, '#FF9800', '⚡'),
        ('python', 'Advanced Citadel', 'advanced', 4, '#9C27B0', '👑'),
        ('data-analysis', 'Beginner Island', 'beginner', 1, '#4CAF50', '🌱'),
        ('data-analysis', 'Basic Bay', 'basic', 2, '#2196F3', '📘'),
        ('data-analysis', 'Intermediate Ridge', 'intermediate', 3, '#FF9800', '⚡'),
        ('data-analysis', 'Advanced Citadel', 'advanced', 4, '#9C27B0', '👑'),
        ('javascript', 'Beginner Island', 'beginner', 1, '#4CAF50', '🌱'),
        ('javascript', 'Basic Bay', 'basic', 2, '#2196F3', '📘'),
        ('javascript', 'Intermediate Ridge', 'intermediate', 3, '#FF9800', '⚡'),
        ('javascript', 'Advanced Citadel', 'advanced', 4, '#9C27B0', '👑'),
        ('ai-specialist', 'Beginner Island', 'beginner', 1, '#4CAF50', '🌱'),
        ('ai-specialist', 'Basic Bay', 'basic', 2, '#2196F3', '📘'),
        ('ai-specialist', 'Intermediate Ridge', 'intermediate', 3, '#FF9800', '⚡'),
        ('ai-specialist', 'Advanced Citadel', 'advanced', 4, '#9C27B0', '👑'),
        ('cybersecurity', 'Beginner Island', 'beginner', 1, '#4CAF50', '🌱'),
        ('cybersecurity', 'Basic Bay', 'basic', 2, '#2196F3', '📘'),
        ('cybersecurity', 'Intermediate Ridge', 'intermediate', 3, '#FF9800', '⚡'),
        ('cybersecurity', 'Advanced Citadel', 'advanced', 4, '#9C27B0', '👑')
)
INSERT INTO levels (track_id, title, difficulty, order_index, theme_color, icon)
SELECT
    tracks.id,
    level_seed.title,
    level_seed.difficulty::difficulty_level,
    level_seed.order_index,
    level_seed.theme_color,
    level_seed.icon
FROM level_seed
JOIN tracks ON tracks.slug = level_seed.track_slug
WHERE NOT EXISTS (
    SELECT 1
    FROM levels
    WHERE levels.track_id = tracks.id
      AND levels.order_index = level_seed.order_index
);

WITH lesson_seed (
    track_slug,
    level_order_index,
    slug,
    title,
    summary,
    theory_md,
    estimated_minutes,
    access_tier,
    lesson_order_index,
    is_published
) AS (
    VALUES
        (
            'cpp', 1, 'hello-world-and-structure',
            'Hello, World! и структура программы',
            'Разбираем точку входа, директивы подключения и базовый вывод в консоль.',
            $$# Hello, World! и структура программы

Первая программа на C++ помогает понять подключения библиотек, функцию main и вывод в консоль.

После урока студент понимает, откуда начинается выполнение программы и как устроен минимальный файл на C++.$$,
            15, 'free', 1, TRUE
        ),
        (
            'cpp', 2, 'arrays-and-bubble-sort',
            'Массивы, максимум и сортировка пузырьком',
            'Учимся проходить по массивам, искать максимум и вручную реализовывать сортировку.',
            $$# Массивы и базовые алгоритмы

Массивы дают первый опыт работы с последовательностями и индексами.

Сортировка пузырьком не самая быстрая, но отлично показывает, как шаг за шагом меняется порядок элементов.$$,
            30, 'free', 1, TRUE
        ),
        (
            'cpp', 3, 'classes-and-exceptions',
            'Классы, методы и безопасные вычисления',
            'Переходим к ООП-модели: поля, конструкторы, методы класса и исключения.',
            $$# Классы и обработка ошибок

Класс объединяет данные и поведение, а исключения помогают корректно сообщать об ошибках.

Этот урок учит описывать предметную сущность и защищать вычисления от некорректных значений.$$,
            35, 'premium', 1, TRUE
        ),
        (
            'cpp', 4, 'templates-and-compile-time',
            'Шаблоны, матрицы и вычисления во время компиляции',
            'Изучаем обобщённое программирование и знакомимся с метапрограммированием.',
            $$# Шаблоны и продвинутый C++

Шаблоны позволяют описывать универсальные структуры данных.

Вычисления на этапе компиляции показывают, как часть логики можно перенести из runtime в compile time.$$,
            45, 'premium', 1, TRUE
        ),
        (
            'python', 1, 'input-conditions-and-loops',
            'Ввод, ветвления и циклы',
            'Осваиваем базовый синтаксис Python через интерактивные консольные сценарии.',
            $$# Ввод, условия и циклы

Python хорош для старта благодаря компактному синтаксису и читаемости.

На первом этапе важно научиться принимать данные от пользователя, сравнивать значения и повторять действия в циклах.$$,
            20, 'free', 1, TRUE
        ),
        (
            'python', 2, 'functions-and-automation',
            'Функции и автоматизация рутины',
            'Строим повторно используемую логику и начинаем писать полезные скрипты.',
            $$# Функции и практическая автоматизация

Функция позволяет упаковать повторяющееся действие в понятный блок.

Этот урок подводит к реальным задачам автоматизации и структурированию кода.$$,
            25, 'free', 1, TRUE
        ),
        (
            'python', 3, 'json-and-http-thinking',
            'JSON, структуры данных и работа с внешними сервисами',
            'Готовимся к backend и интеграциям: словари, списки и преобразование JSON-данных.',
            $$# JSON и интеграции

Большая часть современных приложений обменивается данными в формате JSON.

Перед реальными API полезно научиться разбирать и собирать вложенные структуры локально.$$,
            30, 'premium', 1, TRUE
        ),
        (
            'python', 4, 'portfolio-automation-project',
            'CLI-проект для автоматизации учебных отчётов',
            'Собираем мини-проект, который читает данные о прогрессе и формирует понятный отчёт.',
            $$# Проектный Python

Продвинутый уровень закрепляет навыки через законченную утилиту: разбор данных, функции и форматирование.

Этот проект хорошо подходит в портфолио как пример практической автоматизации.$$,
            40, 'premium', 1, TRUE
        ),
        (
            'data-analysis', 1, 'tables-and-basic-statistics',
            'Таблицы и базовые статистики',
            'Учимся читать набор данных и извлекать из него простые числовые выводы.',
            $$# Первые шаги в аналитике

Аналитика начинается с умения посмотреть на таблицу и понять, что в ней происходит.

Базовые статистики и фильтрация помогают не потеряться даже в небольшом наборе данных.$$,
            20, 'free', 1, TRUE
        ),
        (
            'data-analysis', 2, 'visualization-and-grouping',
            'Группировка данных и визуальные выводы',
            'Собираем агрегаты и переводим сухие числа в понятные аналитические инсайты.',
            $$# От таблицы к инсайту

Нужно сгруппировать данные, сравнить категории и увидеть выбросы.

Визуализация помогает объяснить вывод команде и клиенту.$$,
            25, 'free', 1, TRUE
        ),
        (
            'data-analysis', 3, 'feature-preprocessing',
            'Нормализация и one-hot encoding',
            'Готовим данные к модели: очищаем признаки и переводим категории в числовой формат.',
            $$# Подготовка признаков

Качество модели сильно зависит от качества входных признаков.

Нормализация выравнивает масштабы, а one-hot encoding превращает категории в форму, понятную алгоритмам.$$,
            30, 'premium', 1, TRUE
        ),
        (
            'data-analysis', 4, 'analytics-capstone',
            'Аналитический мини-проект по воронке обучения',
            'Собираем законченную аналитическую задачу: считаем ключевые метрики и формируем выводы.',
            $$# Аналитический capstone

На продвинутом уровне нужно не только посчитать метрику, но и объяснить её смысл.

Итоговый проект тренирует вычисление воронки и формулировку короткой рекомендации.$$,
            40, 'premium', 1, TRUE
        ),
        (
            'javascript', 1, 'syntax-and-functions',
            'Переменные, условия и функции',
            'Стартуем с синтаксиса JavaScript и учимся управлять простыми сценариями в браузере.',
            $$# База JavaScript

JavaScript отвечает за поведение веб-интерфейсов: клики, проверки форм и обновление контента.

Сначала важно уверенно освоить переменные, функции и условные конструкции.$$,
            20, 'free', 1, TRUE
        ),
        (
            'javascript', 2, 'dom-events-and-forms',
            'DOM, события и проверка форм',
            'Учимся связывать код с интерфейсом: кнопки, поля ввода и реакция на действия пользователя.',
            $$# DOM и события

DOM связывает HTML-структуру страницы с JavaScript-кодом.

Базовый фронтенд-разработчик должен уверенно находить элементы и вешать обработчики.$$,
            25, 'free', 1, TRUE
        ),
        (
            'javascript', 3, 'async-and-fetch',
            'Асинхронность, fetch и состояние интерфейса',
            'Разбираем промисы, async/await и работу с API без блокировки интерфейса.',
            $$# Асинхронный JavaScript

Современный фронтенд постоянно общается с сервером, поэтому асинхронность обязательна.

Важно уметь запускать запрос, обрабатывать ошибку и обновлять состояние UI.$$,
            30, 'premium', 1, TRUE
        ),
        (
            'javascript', 4, 'frontend-capstone',
            'Мини-проект: учебная страница трека',
            'Собираем законченную страницу с карточками уроков, фильтрами и статусами прогресса.',
            $$# Проектный фронтенд

Итоговая задача по JavaScript должна показать и знание синтаксиса, и понимание пользовательского сценария.

Такой проект удобно развивать дальше уже в сторону React и Next.js.$$,
            40, 'premium', 1, TRUE
        ),
        (
            'ai-specialist', 1, 'perceptron-basics',
            'Перцептрон и линейная классификация',
            'Вводим ключевую идею нейросети на простом примере: веса, сумма и порог.',
            $$# Перцептрон

Перцептрон — удобная точка входа в мир нейросетей: у него мало компонентов, но он показывает главную идею модели.

Мы складываем признаки с весами, применяем порог и получаем решение о классе.$$,
            25, 'free', 1, TRUE
        ),
        (
            'ai-specialist', 2, 'preprocessing-and-metrics',
            'Предобработка данных и оценка качества',
            'Учимся нормализовать признаки, кодировать категории и читать accuracy с confusion matrix.',
            $$# Подготовка данных и метрики

Даже хорошая модель не спасёт плохой вход, поэтому ещё до обучения важно подготовить признаки.

Accuracy даёт общий сигнал, а confusion matrix показывает, где именно модель ошибается.$$,
            30, 'free', 1, TRUE
        ),
        (
            'ai-specialist', 3, 'mnist-dense-network',
            'Плотная нейросеть для распознавания цифр',
            'Разбираем тренировочный цикл и структуру простой модели на задаче классификации.',
            $$# Плотная сеть и обучение

После понимания признаков и метрик можно переходить к первой полноценной модели.

На примере MNIST удобно объяснять батчи, эпохи и роль валидации.$$,
            35, 'premium', 1, TRUE
        ),
        (
            'ai-specialist', 4, 'transformers-and-nlp',
            'Трансформеры и прикладной NLP',
            'Понимаем, как устроены современные языковые модели и как готовить данные для fine-tuning.',
            $$# Трансформеры и NLP

Трансформеры стали стандартом для задач работы с текстом благодаря механизму внимания.

На практике важны не только слои модели, но и формат датасета и корректная оценка качества.$$,
            45, 'premium', 1, TRUE
        ),
        (
            'cybersecurity', 1, 'cipher-and-passwords',
            'Шифр Цезаря и надёжные пароли',
            'Через простые упражнения понимаем базовые идеи защиты данных и проверки сложности.',
            $$# Первые шаги в кибербезопасности

Старт лучше делать на понятных примерах: примитивное шифрование, базовые правила паролей и идея защиты данных.

Это помогает связать безопасность с конкретными инженерными решениями.$$,
            20, 'free', 1, TRUE
        ),
        (
            'cybersecurity', 2, 'web-vulnerabilities-basics',
            'SQL-инъекции, XSS и безопасный вывод',
            'Разбираем популярные веб-уязвимости и учимся устранять их на уровне кода.',
            $$# Базовые веб-уязвимости

SQL-инъекция и XSS остаются важными, потому что возникают в обычных пользовательских сценариях.

Разработчику важно увидеть, где именно в коде появляется риск и как его убрать.$$,
            30, 'free', 1, TRUE
        ),
        (
            'cybersecurity', 3, 'logs-and-anomaly-analysis',
            'Анализ логов и поиск аномалий',
            'Учимся читать журналы событий и находить сигналы атак и подозрительного поведения.',
            $$# Логи и инциденты

Логи — один из самых практичных источников данных для расследования инцидентов.

Даже простые эвристики помогают находить всплески запросов и необычные IP-адреса.$$,
            35, 'premium', 1, TRUE
        ),
        (
            'cybersecurity', 4, 'secure-audit-capstone',
            'Итоговый аудит учебного веб-приложения',
            'Собираем угрозы, проверки и рекомендации в один законченный security-capstone.',
            $$# Security capstone

Итоговый модуль имитирует реальный аудит: нужно увидеть риск, объяснить его и предложить конкретное исправление.

Результат можно использовать как первый кейс в портфолио по AppSec.$$,
            45, 'premium', 1, TRUE
        )
)
INSERT INTO lessons (
    level_id,
    slug,
    title,
    summary,
    theory_md,
    estimated_minutes,
    access_tier,
    order_index,
    is_published
)
SELECT
    levels.id,
    lesson_seed.slug,
    lesson_seed.title,
    lesson_seed.summary,
    lesson_seed.theory_md,
    lesson_seed.estimated_minutes,
    lesson_seed.access_tier::access_tier,
    lesson_seed.lesson_order_index,
    lesson_seed.is_published
FROM lesson_seed
JOIN tracks ON tracks.slug = lesson_seed.track_slug
JOIN levels ON levels.track_id = tracks.id AND levels.order_index = lesson_seed.level_order_index
WHERE NOT EXISTS (
    SELECT 1
    FROM lessons
    WHERE lessons.level_id = levels.id
      AND lessons.slug = lesson_seed.slug
);

WITH task_seed (
    track_slug,
    lesson_slug,
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
) AS (
    VALUES
        ('cpp', 'hello-world-and-structure', 'print-hello-cpp', 'Выведи приветствие', 'Напиши программу, которая выводит `Hello, CodeNovsu!` в консоль.', 'cpp', 'beginner', $$#include <iostream>

int main() {
    // TODO: print Hello, CodeNovsu!
    return 0;
}
$$, NULL, 3, 'free', 10, FALSE, FALSE),
        ('cpp', 'arrays-and-bubble-sort', 'analyze-array-cpp', 'Найди максимум и отсортируй массив', 'Дополни программу: найди максимальный элемент массива и выведи отсортированную последовательность.', 'cpp', 'basic', $$#include <iostream>

int main() {
    int numbers[] = {7, 4, 9, 1, 5};
    int size = sizeof(numbers) / sizeof(numbers[0]);

    // TODO: find max
    // TODO: bubble sort
    return 0;
}
$$, NULL, 3, 'free', 25, FALSE, FALSE),
        ('cpp', 'classes-and-exceptions', 'car-class-safe-speed', 'Класс Car и проверка скорости', 'Создай класс `Car` с полями `brand` и `speed`. Метод `travelTime` должен бросать исключение при скорости `0`.', 'cpp', 'intermediate', $$#include <iostream>
#include <stdexcept>
#include <string>

class Car {
public:
    // TODO: add fields and constructor
    double travelTime(double distance) const {
        // TODO: throw if speed == 0
        return 0.0;
    }
};

int main() {
    return 0;
}
$$, NULL, 3, 'premium', 30, FALSE, FALSE),
        ('cpp', 'templates-and-compile-time', 'matrix-template-factorial', 'Шаблон Matrix и compile-time factorial', 'Собери шаблонный класс `Matrix<T>` и добавь пример вычисления факториала на этапе компиляции.', 'cpp', 'advanced', $$#include <iostream>

template <typename T>
class Matrix {
public:
    // TODO: store 2x2 matrix and sum elements
};

template <int N>
struct Factorial {
    // TODO: compile-time factorial
};

int main() {
    return 0;
}
$$, NULL, 3, 'premium', 40, TRUE, TRUE),
        ('python', 'input-conditions-and-loops', 'guess-parity-python', 'Определи чётность числа', 'Напиши программу, которая читает число и выводит `even`, если оно чётное, иначе `odd`.', 'python', 'beginner', $$number = int(input())

# TODO: print even or odd
$$, NULL, 3, 'free', 10, FALSE, FALSE),
        ('python', 'functions-and-automation', 'todo-cleanup-python', 'Очистка списка задач', 'Реализуй функцию, которая принимает список строк и возвращает только непустые задачи без повторов.', 'python', 'basic', $$def cleanup_tasks(items):
    # TODO: return unique non-empty tasks preserving order
    return []

tasks = ['code', '', 'review', 'code', 'deploy']
print(cleanup_tasks(tasks))
$$, NULL, 3, 'free', 20, FALSE, FALSE),
        ('python', 'json-and-http-thinking', 'summarize-json-python', 'Собери сводку по JSON-данным', 'Дан словарь с уроками и длительностью. Напиши функцию, которая вернёт суммарное время только по опубликованным урокам.', 'python', 'intermediate', $$def total_published_minutes(items):
    # TODO: sum only published lessons
    return 0

data = [
    {'title': 'Intro', 'minutes': 15, 'published': True},
    {'title': 'Draft', 'minutes': 40, 'published': False},
    {'title': 'Loops', 'minutes': 20, 'published': True},
]
print(total_published_minutes(data))
$$, NULL, 3, 'premium', 25, FALSE, FALSE),
        ('python', 'portfolio-automation-project', 'progress-report-cli', 'Сформируй отчёт по прогрессу', 'Заверши CLI-утилиту, которая считает завершённые и незавершённые уроки и печатает итоговый отчёт.', 'python', 'advanced', $$progress = [
    {'title': 'Intro', 'done': True},
    {'title': 'Loops', 'done': True},
    {'title': 'API', 'done': False},
]

def render_report(items):
    # TODO: print completed, pending and completion percent
    pass

render_report(progress)
$$, NULL, 3, 'premium', 35, TRUE, TRUE),
        ('data-analysis', 'tables-and-basic-statistics', 'average-score-python', 'Посчитай средний балл', 'Напиши функцию, которая возвращает среднее значение из списка чисел с округлением до двух знаков.', 'python', 'beginner', $$def average_score(values):
    # TODO: return average rounded to 2 decimals
    return 0

print(average_score([5, 4, 3, 5]))
$$, NULL, 3, 'free', 12, FALSE, FALSE),
        ('data-analysis', 'visualization-and-grouping', 'group-sales-python', 'Сгруппируй продажи по категориям', 'Верни словарь с суммой продаж по каждой категории.', 'python', 'basic', $$def group_sales(rows):
    # TODO: aggregate totals by category
    return {}

sales = [
    {'category': 'books', 'amount': 120},
    {'category': 'books', 'amount': 80},
    {'category': 'courses', 'amount': 300},
]
print(group_sales(sales))
$$, NULL, 3, 'free', 18, FALSE, FALSE),
        ('data-analysis', 'feature-preprocessing', 'normalize-values-python', 'Нормализуй числовой столбец', 'Реализуй min-max нормализацию для списка чисел. Для одинаковых значений возвращай список из нулей.', 'python', 'intermediate', $$def minmax_scale(values):
    # TODO: normalize values into range [0, 1]
    return []

print(minmax_scale([10, 20, 30]))
$$, NULL, 3, 'premium', 22, FALSE, FALSE),
        ('data-analysis', 'analytics-capstone', 'funnel-conversion-python', 'Посчитай конверсию воронки', 'Получив список этапов воронки, выведи процент конверсии между первым и последним этапом.', 'python', 'advanced', $$def funnel_conversion(stages):
    # TODO: return total conversion percent as integer
    return 0

print(funnel_conversion([1000, 650, 260]))
$$, NULL, 3, 'premium', 28, TRUE, TRUE),
        ('javascript', 'syntax-and-functions', 'greet-user-js', 'Собери приветствие', 'Реализуй функцию `greetUser`, которая возвращает строку `Hello, <name>!`.', 'javascript', 'beginner', $$function greetUser(name) {
  // TODO: return greeting
}

console.log(greetUser('CodeNovsu'));
$$, NULL, 3, 'free', 10, FALSE, FALSE),
        ('javascript', 'dom-events-and-forms', 'validate-login-js', 'Проверь форму входа', 'Напиши функцию `validateLogin`, которая возвращает `true`, если email содержит `@`, а пароль длиннее 7 символов.', 'javascript', 'basic', $$function validateLogin(email, password) {
  // TODO: validate login form
  return false;
}

console.log(validateLogin('student@site.ru', 'strong123'));
$$, NULL, 3, 'free', 15, FALSE, FALSE),
        ('javascript', 'async-and-fetch', 'map-api-result-js', 'Преобразуй ответ API', 'Реализуй функцию, которая принимает массив уроков и возвращает только названия опубликованных записей в верхнем регистре.', 'javascript', 'intermediate', $$function mapLessons(items) {
  // TODO: filter published and uppercase titles
  return [];
}

const lessons = [
  { title: 'Intro', published: true },
  { title: 'Draft', published: false },
  { title: 'Loops', published: true },
];
console.log(mapLessons(lessons));
$$, NULL, 3, 'premium', 20, FALSE, FALSE),
        ('javascript', 'frontend-capstone', 'render-track-cards-js', 'Собери карточки уроков', 'Заверши функцию, которая превращает список уроков в HTML-разметку карточек с названием и статусом.', 'javascript', 'advanced', $$function renderCards(items) {
  // TODO: return HTML string
  return '';
}

const lessons = [
  { title: 'Intro', status: 'done' },
  { title: 'Loops', status: 'current' },
];
console.log(renderCards(lessons));
$$, NULL, 3, 'premium', 30, TRUE, TRUE),
        ('ai-specialist', 'perceptron-basics', 'point-classifier-python', 'Классифицируй точку перцептроном', 'Заверши функцию `predict_point`, которая возвращает `1`, если взвешенная сумма неотрицательна, иначе `0`.', 'python', 'beginner', $$def predict_point(x1, x2, w1, w2, bias):
    # TODO: compute weighted sum and threshold
    return 0

print(predict_point(2, 1, 1, 1, -2))
$$, NULL, 3, 'free', 15, FALSE, FALSE),
        ('ai-specialist', 'preprocessing-and-metrics', 'accuracy-metric-python', 'Посчитай accuracy', 'Реализуй функцию, которая считает долю совпавших предсказаний и правильных ответов.', 'python', 'basic', $$def accuracy_score(y_true, y_pred):
    # TODO: calculate accuracy
    return 0

print(accuracy_score([1, 0, 1, 1], [1, 1, 1, 0]))
$$, NULL, 3, 'free', 18, FALSE, FALSE),
        ('ai-specialist', 'mnist-dense-network', 'batch-loss-python', 'Вычисли среднюю loss по батчу', 'Напиши функцию, которая принимает список значений функции потерь и возвращает среднее значение.', 'python', 'intermediate', $$def mean_loss(losses):
    # TODO: return average loss
    return 0

print(mean_loss([0.9, 0.6, 0.3]))
$$, NULL, 3, 'premium', 15, FALSE, FALSE),
        ('ai-specialist', 'transformers-and-nlp', 'token-budget-python', 'Оцени токенный бюджет датасета', 'Реализуй функцию, которая суммирует количество токенов по списку документов и предупреждает, если лимит превышен.', 'python', 'advanced', $$def token_budget(lengths, limit):
    # TODO: return total and over_limit flag
    return 0, False

print(token_budget([120, 80, 60], 250))
$$, NULL, 3, 'premium', 25, TRUE, TRUE),
        ('cybersecurity', 'cipher-and-passwords', 'password-strength-python', 'Проверь сложность пароля', 'Реализуй функцию, которая возвращает `strong`, если пароль длиннее 7 символов и содержит буквы и цифры, иначе `weak`.', 'python', 'beginner', $$def password_strength(password):
    # TODO: classify password as strong or weak
    return 'weak'

print(password_strength('SafePass123'))
$$, NULL, 3, 'free', 12, FALSE, FALSE),
        ('cybersecurity', 'web-vulnerabilities-basics', 'escape-html-js', 'Экранируй пользовательский ввод', 'Реализуй функцию `escapeHtml`, которая заменяет `<` и `>` на безопасные сущности.', 'javascript', 'basic', $$function escapeHtml(value) {
  // TODO: replace < and > with safe entities
  return value;
}

console.log(escapeHtml('<script>alert(1)</script>'));
$$, NULL, 3, 'free', 18, FALSE, FALSE),
        ('cybersecurity', 'logs-and-anomaly-analysis', 'detect-suspicious-ip-python', 'Найди подозрительный IP', 'Напиши функцию, которая возвращает IP-адрес, встретившийся в логе чаще остальных.', 'python', 'intermediate', $$def most_frequent_ip(entries):
    # TODO: return the most frequent ip
    return ''

logs = ['10.0.0.1', '10.0.0.2', '10.0.0.1', '10.0.0.1']
print(most_frequent_ip(logs))
$$, NULL, 3, 'premium', 20, FALSE, FALSE),
        ('cybersecurity', 'secure-audit-capstone', 'security-report-python', 'Сформируй краткий отчёт об аудите', 'Заверши функцию, которая принимает список найденных рисков и печатает количество критичных и общее число замечаний.', 'python', 'advanced', $$def audit_summary(items):
    # TODO: print total and critical issues
    pass

risks = [
    {'title': 'XSS', 'severity': 'high'},
    {'title': 'Weak password policy', 'severity': 'medium'},
    {'title': 'CSRF', 'severity': 'high'},
]
audit_summary(risks)
$$, NULL, 3, 'premium', 25, TRUE, TRUE)
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
    lessons.id,
    task_seed.slug,
    task_seed.title,
    task_seed.description_md,
    task_seed.language::task_language,
    task_seed.difficulty::difficulty_level,
    task_seed.starter_code,
    task_seed.solution_template,
    task_seed.max_hints,
    task_seed.access_tier::access_tier,
    task_seed.estimated_minutes,
    task_seed.is_project_step,
    task_seed.is_boss
FROM task_seed
JOIN tracks ON tracks.slug = task_seed.track_slug
JOIN levels ON levels.track_id = tracks.id
JOIN lessons ON lessons.level_id = levels.id AND lessons.slug = task_seed.lesson_slug
WHERE NOT EXISTS (
    SELECT 1
    FROM tasks
    WHERE tasks.lesson_id = lessons.id
      AND tasks.slug = task_seed.slug
);

WITH test_case_seed (
    track_slug,
    lesson_slug,
    task_slug,
    kind,
    input_payload,
    expected_output,
    is_hidden,
    weight
) AS (
    VALUES
        ('cpp', 'hello-world-and-structure', 'print-hello-cpp', 'stdout', '', 'Hello, CodeNovsu!', FALSE, 1),
        ('cpp', 'arrays-and-bubble-sort', 'analyze-array-cpp', 'stdout', '', 'Max: 9\nSorted: 1 4 5 7 9', FALSE, 1),
        ('cpp', 'classes-and-exceptions', 'car-class-safe-speed', 'stdout', '', '2', FALSE, 1),
        ('cpp', 'templates-and-compile-time', 'matrix-template-factorial', 'stdout', '', 'Sum: 10\nF5: 120', FALSE, 1),
        ('python', 'input-conditions-and-loops', 'guess-parity-python', 'stdout', '12', 'even', FALSE, 1),
        ('python', 'functions-and-automation', 'todo-cleanup-python', 'stdout', '', '[''code'', ''review'', ''deploy'']', FALSE, 1),
        ('python', 'json-and-http-thinking', 'summarize-json-python', 'stdout', '', '35', FALSE, 1),
        ('python', 'portfolio-automation-project', 'progress-report-cli', 'stdout', '', 'Completed: 2\nPending: 1\nProgress: 67%', FALSE, 1),
        ('data-analysis', 'tables-and-basic-statistics', 'average-score-python', 'stdout', '', '4.25', FALSE, 1),
        ('data-analysis', 'visualization-and-grouping', 'group-sales-python', 'stdout', '', '{''books'': 200, ''courses'': 300}', FALSE, 1),
        ('data-analysis', 'feature-preprocessing', 'normalize-values-python', 'stdout', '', '[0.0, 0.5, 1.0]', FALSE, 1),
        ('data-analysis', 'analytics-capstone', 'funnel-conversion-python', 'stdout', '', '26', FALSE, 1),
        ('javascript', 'syntax-and-functions', 'greet-user-js', 'stdout', '', 'Hello, CodeNovsu!', FALSE, 1),
        ('javascript', 'dom-events-and-forms', 'validate-login-js', 'stdout', '', 'true', FALSE, 1),
        ('javascript', 'async-and-fetch', 'map-api-result-js', 'stdout', '', '[''INTRO'', ''LOOPS'']', FALSE, 1),
        ('javascript', 'frontend-capstone', 'render-track-cards-js', 'stdout', '', '<article', FALSE, 1),
        ('ai-specialist', 'perceptron-basics', 'point-classifier-python', 'stdout', '', '1', FALSE, 1),
        ('ai-specialist', 'preprocessing-and-metrics', 'accuracy-metric-python', 'stdout', '', '0.5', FALSE, 1),
        ('ai-specialist', 'mnist-dense-network', 'batch-loss-python', 'stdout', '', '0.6', FALSE, 1),
        ('ai-specialist', 'transformers-and-nlp', 'token-budget-python', 'stdout', '', '(260, True)', FALSE, 1),
        ('cybersecurity', 'cipher-and-passwords', 'password-strength-python', 'stdout', '', 'strong', FALSE, 1),
        ('cybersecurity', 'web-vulnerabilities-basics', 'escape-html-js', 'stdout', '', '&lt;script&gt;alert(1)&lt;/script&gt;', FALSE, 1),
        ('cybersecurity', 'logs-and-anomaly-analysis', 'detect-suspicious-ip-python', 'stdout', '', '10.0.0.1', FALSE, 1),
        ('cybersecurity', 'secure-audit-capstone', 'security-report-python', 'stdout', '', 'Total: 3\nHigh severity: 2', FALSE, 1)
)
INSERT INTO task_test_cases (
    task_id,
    kind,
    input_payload,
    expected_output,
    is_hidden,
    weight
)
SELECT
    tasks.id,
    test_case_seed.kind,
    test_case_seed.input_payload,
    test_case_seed.expected_output,
    test_case_seed.is_hidden,
    test_case_seed.weight
FROM test_case_seed
JOIN tracks ON tracks.slug = test_case_seed.track_slug
JOIN levels ON levels.track_id = tracks.id
JOIN lessons ON lessons.level_id = levels.id AND lessons.slug = test_case_seed.lesson_slug
JOIN tasks ON tasks.lesson_id = lessons.id AND tasks.slug = test_case_seed.task_slug
WHERE NOT EXISTS (
    SELECT 1
    FROM task_test_cases
    WHERE task_test_cases.task_id = tasks.id
      AND task_test_cases.expected_output = test_case_seed.expected_output
);
