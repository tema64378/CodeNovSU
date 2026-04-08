import type { AccessTier } from "@/lib/types";

type Difficulty = "beginner" | "basic" | "intermediate" | "advanced";
type TaskLanguage = "python" | "cpp" | "javascript" | "html_css";

interface CurriculumTestCase {
  kind: string;
  input_payload: string;
  expected_output: string;
  weight: number;
}

interface CurriculumTask {
  slug: string;
  title: string;
  description_md: string;
  language: TaskLanguage;
  difficulty: Difficulty;
  starter_code: string;
  solution_template: string | null;
  max_hints: number;
  access_tier: AccessTier;
  estimated_minutes: number;
  is_project_step: boolean;
  is_boss: boolean;
  visible_test_cases: CurriculumTestCase[];
}

interface CurriculumLesson {
  slug: string;
  title: string;
  summary: string;
  theory_md: string;
  estimated_minutes: number;
  access_tier: AccessTier;
  order_index: number;
  tasks: CurriculumTask[];
}

interface CurriculumLevel {
  title: string;
  difficulty: Difficulty;
  order_index: number;
  theme_color: string;
  icon: string;
  lessons: CurriculumLesson[];
}

interface CurriculumTrack {
  slug: string;
  title: string;
  description: string;
  category: string;
  is_premium: boolean;
  is_published: boolean;
  levels: CurriculumLevel[];
}

const md = (...lines: string[]) => lines.join("\n");
const code = (...lines: string[]) => `${lines.join("\n")}\n`;

export const curriculumCatalog: CurriculumTrack[] = [
  {
    slug: "cpp",
    title: "C++",
    description: "Системное программирование, алгоритмы, STL и инженерное мышление от базы до оптимизации.",
    category: "programming",
    is_premium: false,
    is_published: true,
    levels: [
      {
        title: "Beginner Island",
        difficulty: "beginner",
        order_index: 1,
        theme_color: "#4CAF50",
        icon: "🌱",
        lessons: [
          {
            slug: "hello-world-and-structure",
            title: "Hello, World! и структура программы",
            summary: "Разбираем точку входа, директивы подключения и базовый вывод в консоль.",
            theory_md: md(
              "# Hello, World! и структура программы",
              "",
              "Первая программа на C++ помогает понять три ключевые части файла: подключения библиотек, функцию main и возврат кода завершения.",
              "",
              "Важно не просто повторить пример, а увидеть, где начинается выполнение программы и как текст попадает в консоль.",
              "",
              "После этого урока студент может читать простейшие примеры и уверенно запускать код в IDE."
            ),
            estimated_minutes: 15,
            access_tier: "free",
            order_index: 1,
            tasks: [
              {
                slug: "print-hello-cpp",
                title: "Выведи приветствие",
                description_md: "Напиши программу, которая выводит `Hello, CodeNovsu!` в консоль.",
                language: "cpp",
                difficulty: "beginner",
                starter_code: code(
                  "#include <iostream>",
                  "",
                  "int main() {",
                  "    // TODO: print Hello, CodeNovsu!",
                  "    return 0;",
                  "}"
                ),
                solution_template: null,
                max_hints: 3,
                access_tier: "free",
                estimated_minutes: 10,
                is_project_step: false,
                is_boss: false,
                visible_test_cases: [
                  {
                    kind: "stdout",
                    input_payload: "",
                    expected_output: "Hello, CodeNovsu!",
                    weight: 1,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        title: "Basic Bay",
        difficulty: "basic",
        order_index: 2,
        theme_color: "#2196F3",
        icon: "📘",
        lessons: [
          {
            slug: "arrays-and-bubble-sort",
            title: "Массивы, максимум и сортировка пузырьком",
            summary: "Учимся проходить по массивам, искать максимум и вручную реализовывать простую сортировку.",
            theory_md: md(
              "# Массивы и базовые алгоритмы",
              "",
              "Массивы дают первый опыт работы с последовательностями данных и индексами.",
              "",
              "На этом этапе важно научиться проходить по элементам, хранить промежуточный максимум и понимать, почему сортировка пузырьком медленная, но полезна для обучения.",
              "",
              "Этот урок закладывает базу для последующего перехода к STL-контейнерам и алгоритмам."
            ),
            estimated_minutes: 30,
            access_tier: "free",
            order_index: 1,
            tasks: [
              {
                slug: "analyze-array-cpp",
                title: "Найди максимум и отсортируй массив",
                description_md: "Дополни программу: найди максимальный элемент массива и выведи отсортированную по возрастанию последовательность.",
                language: "cpp",
                difficulty: "basic",
                starter_code: code(
                  "#include <iostream>",
                  "",
                  "int main() {",
                  "    int numbers[] = {7, 4, 9, 1, 5};",
                  "    int size = sizeof(numbers) / sizeof(numbers[0]);",
                  "",
                  "    // TODO: find max",
                  "    // TODO: bubble sort",
                  "    // Expected output:",
                  "    // Max: 9",
                  "    // Sorted: 1 4 5 7 9",
                  "    return 0;",
                  "}"
                ),
                solution_template: null,
                max_hints: 3,
                access_tier: "free",
                estimated_minutes: 25,
                is_project_step: false,
                is_boss: false,
                visible_test_cases: [
                  {
                    kind: "stdout",
                    input_payload: "",
                    expected_output: "Max: 9\nSorted: 1 4 5 7 9",
                    weight: 1,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        title: "Intermediate Ridge",
        difficulty: "intermediate",
        order_index: 3,
        theme_color: "#FF9800",
        icon: "⚡",
        lessons: [
          {
            slug: "classes-and-exceptions",
            title: "Классы, методы и безопасные вычисления",
            summary: "Переходим к ООП-модели: поля, конструкторы, методы класса и исключения.",
            theory_md: md(
              "# Классы и обработка ошибок",
              "",
              "Класс объединяет данные и поведение, а исключения помогают корректно сообщать об ошибках вместо молчаливого сбоя.",
              "",
              "В реальном коде эти темы идут рядом: объект хранит состояние, а методы проверяют корректность входных данных.",
              "",
              "После урока студент понимает, как описать предметную сущность и защитить вычисление от некорректных значений."
            ),
            estimated_minutes: 35,
            access_tier: "premium",
            order_index: 1,
            tasks: [
              {
                slug: "car-class-safe-speed",
                title: "Класс Car и проверка скорости",
                description_md: "Создай класс `Car` с полями `brand` и `speed`. Метод `travelTime` должен бросать исключение при скорости `0` и возвращать время поездки.",
                language: "cpp",
                difficulty: "intermediate",
                starter_code: code(
                  "#include <iostream>",
                  "#include <stdexcept>",
                  "#include <string>",
                  "",
                  "class Car {",
                  "public:",
                  "    // TODO: add fields and constructor",
                  "    double travelTime(double distance) const {",
                  "        // TODO: throw if speed == 0",
                  "        return 0.0;",
                  "    }",
                  "};",
                  "",
                  "int main() {",
                  "    // Expected output: 2",
                  "    return 0;",
                  "}"
                ),
                solution_template: null,
                max_hints: 3,
                access_tier: "premium",
                estimated_minutes: 30,
                is_project_step: false,
                is_boss: false,
                visible_test_cases: [
                  {
                    kind: "stdout",
                    input_payload: "",
                    expected_output: "2",
                    weight: 1,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        title: "Advanced Citadel",
        difficulty: "advanced",
        order_index: 4,
        theme_color: "#9C27B0",
        icon: "👑",
        lessons: [
          {
            slug: "templates-and-compile-time",
            title: "Шаблоны, матрицы и вычисления во время компиляции",
            summary: "Изучаем обобщённое программирование и знакомимся с метапрограммированием на практике.",
            theory_md: md(
              "# Шаблоны и продвинутый C++",
              "",
              "Шаблоны позволяют описывать универсальные структуры данных, а вычисления на этапе компиляции помогают переносить часть логики из runtime в compile time.",
              "",
              "Для продвинутого уровня важно не только написать код, но и объяснить, какую задачу решает шаблон и зачем нам типобезопасность.",
              "",
              "Финальная задача уровня совмещает инженерную аккуратность и понимание внутренней модели языка."
            ),
            estimated_minutes: 45,
            access_tier: "premium",
            order_index: 1,
            tasks: [
              {
                slug: "matrix-template-factorial",
                title: "Шаблон Matrix и compile-time factorial",
                description_md: "Собери шаблонный класс `Matrix<T>` и добавь пример вычисления факториала на этапе компиляции.",
                language: "cpp",
                difficulty: "advanced",
                starter_code: code(
                  "#include <iostream>",
                  "",
                  "template <typename T>",
                  "class Matrix {",
                  "public:",
                  "    // TODO: store 2x2 matrix and sum elements",
                  "};",
                  "",
                  "template <int N>",
                  "struct Factorial {",
                  "    // TODO: compile-time factorial",
                  "};",
                  "",
                  "int main() {",
                  "    // Expected output:",
                  "    // Sum: 10",
                  "    // F5: 120",
                  "    return 0;",
                  "}"
                ),
                solution_template: null,
                max_hints: 3,
                access_tier: "premium",
                estimated_minutes: 40,
                is_project_step: true,
                is_boss: true,
                visible_test_cases: [
                  {
                    kind: "stdout",
                    input_payload: "",
                    expected_output: "Sum: 10\nF5: 120",
                    weight: 1,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "python",
    title: "Python",
    description: "Базовый синтаксис, автоматизация, работа с API и практические инструменты для начинающих.",
    category: "programming",
    is_premium: false,
    is_published: true,
    levels: [
      {
        title: "Beginner Island",
        difficulty: "beginner",
        order_index: 1,
        theme_color: "#4CAF50",
        icon: "🌱",
        lessons: [
          {
            slug: "input-conditions-and-loops",
            title: "Ввод, ветвления и циклы",
            summary: "Осваиваем базовый синтаксис Python через интерактивные консольные сценарии.",
            theory_md: md(
              "# Ввод, условия и циклы",
              "",
              "Python хорош для старта благодаря компактному синтаксису и читаемости.",
              "",
              "На первом этапе важно научиться принимать данные от пользователя, сравнивать значения и повторять действия в циклах.",
              "",
              "Эти конструкции станут основой для автоматизации, анализа данных и задач по ИИ."
            ),
            estimated_minutes: 20,
            access_tier: "free",
            order_index: 1,
            tasks: [
              {
                slug: "guess-parity-python",
                title: "Определи чётность числа",
                description_md: "Напиши программу, которая читает число и выводит `even`, если оно чётное, иначе `odd`.",
                language: "python",
                difficulty: "beginner",
                starter_code: code(
                  "number = int(input())",
                  "",
                  "# TODO: print even or odd"
                ),
                solution_template: null,
                max_hints: 3,
                access_tier: "free",
                estimated_minutes: 10,
                is_project_step: false,
                is_boss: false,
                visible_test_cases: [
                  {
                    kind: "stdout",
                    input_payload: "12",
                    expected_output: "even",
                    weight: 1,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        title: "Basic Bay",
        difficulty: "basic",
        order_index: 2,
        theme_color: "#2196F3",
        icon: "📘",
        lessons: [
          {
            slug: "functions-and-automation",
            title: "Функции и автоматизация рутины",
            summary: "Строим повторно используемую логику и начинаем писать маленькие полезные скрипты.",
            theory_md: md(
              "# Функции и практическая автоматизация",
              "",
              "Функция позволяет упаковать повторяющееся действие в один понятный блок.",
              "",
              "На практике это помогает писать скрипты для сортировки, преобразования и проверки данных без копирования кода.",
              "",
              "Урок подводит к реальным задачам автоматизации и командной разработке."
            ),
            estimated_minutes: 25,
            access_tier: "free",
            order_index: 1,
            tasks: [
              {
                slug: "todo-cleanup-python",
                title: "Очистка списка задач",
                description_md: "Реализуй функцию, которая принимает список строк и возвращает только непустые задачи без повторов.",
                language: "python",
                difficulty: "basic",
                starter_code: code(
                  "def cleanup_tasks(items):",
                  "    # TODO: return unique non-empty tasks preserving order",
                  "    return []",
                  "",
                  "tasks = ['code', '', 'review', 'code', 'deploy']",
                  "print(cleanup_tasks(tasks))"
                ),
                solution_template: null,
                max_hints: 3,
                access_tier: "free",
                estimated_minutes: 20,
                is_project_step: false,
                is_boss: false,
                visible_test_cases: [
                  {
                    kind: "stdout",
                    input_payload: "",
                    expected_output: "['code', 'review', 'deploy']",
                    weight: 1,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        title: "Intermediate Ridge",
        difficulty: "intermediate",
        order_index: 3,
        theme_color: "#FF9800",
        icon: "⚡",
        lessons: [
          {
            slug: "json-and-http-thinking",
            title: "JSON, структуры данных и работа с внешними сервисами",
            summary: "Готовимся к backend и интеграциям: словари, списки и преобразование JSON-данных.",
            theory_md: md(
              "# JSON и интеграции",
              "",
              "Большая часть современных приложений обменивается данными в формате JSON.",
              "",
              "Перед реальными API полезно научиться разбирать и собирать вложенные структуры локально: это снижает когнитивную нагрузку.",
              "",
              "После урока студент уверенно читает словари, списки и готовит полезный payload для сервисов."
            ),
            estimated_minutes: 30,
            access_tier: "premium",
            order_index: 1,
            tasks: [
              {
                slug: "summarize-json-python",
                title: "Собери сводку по JSON-данным",
                description_md: "Дан словарь с уроками и длительностью. Напиши функцию, которая вернёт суммарное время только по опубликованным урокам.",
                language: "python",
                difficulty: "intermediate",
                starter_code: code(
                  "def total_published_minutes(items):",
                  "    # TODO: sum only published lessons",
                  "    return 0",
                  "",
                  "data = [",
                  "    {'title': 'Intro', 'minutes': 15, 'published': True},",
                  "    {'title': 'Draft', 'minutes': 40, 'published': False},",
                  "    {'title': 'Loops', 'minutes': 20, 'published': True},",
                  "]",
                  "print(total_published_minutes(data))"
                ),
                solution_template: null,
                max_hints: 3,
                access_tier: "premium",
                estimated_minutes: 25,
                is_project_step: false,
                is_boss: false,
                visible_test_cases: [
                  {
                    kind: "stdout",
                    input_payload: "",
                    expected_output: "35",
                    weight: 1,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        title: "Advanced Citadel",
        difficulty: "advanced",
        order_index: 4,
        theme_color: "#9C27B0",
        icon: "👑",
        lessons: [
          {
            slug: "portfolio-automation-project",
            title: "CLI-проект для автоматизации учебных отчётов",
            summary: "Собираем мини-проект, который читает данные о прогрессе и формирует понятный текстовый отчёт.",
            theory_md: md(
              "# Проектный Python",
              "",
              "Продвинутый уровень закрепляет навыки через законченную утилиту: разбор данных, функции, форматирование и структура проекта.",
              "",
              "Здесь важно думать не только о правильном результате, но и о том, насколько удобен код для поддержки.",
              "",
              "Этот проект хорошо подходит в портфолио как пример практической автоматизации."
            ),
            estimated_minutes: 40,
            access_tier: "premium",
            order_index: 1,
            tasks: [
              {
                slug: "progress-report-cli",
                title: "Сформируй отчёт по прогрессу",
                description_md: "Заверши CLI-утилиту, которая считает завершённые и незавершённые уроки и печатает итоговый отчёт.",
                language: "python",
                difficulty: "advanced",
                starter_code: code(
                  "progress = [",
                  "    {'title': 'Intro', 'done': True},",
                  "    {'title': 'Loops', 'done': True},",
                  "    {'title': 'API', 'done': False},",
                  "]",
                  "",
                  "def render_report(items):",
                  "    # TODO: print completed, pending and completion percent",
                  "    pass",
                  "",
                  "render_report(progress)"
                ),
                solution_template: null,
                max_hints: 3,
                access_tier: "premium",
                estimated_minutes: 35,
                is_project_step: true,
                is_boss: true,
                visible_test_cases: [
                  {
                    kind: "stdout",
                    input_payload: "",
                    expected_output: "Completed: 2\nPending: 1\nProgress: 67%",
                    weight: 1,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "data-analysis",
    title: "Data Analysis",
    description: "Практика с таблицами, визуализацией, метриками и подготовкой данных для продуктовых решений.",
    category: "data",
    is_premium: false,
    is_published: true,
    levels: [
      {
        title: "Beginner Island",
        difficulty: "beginner",
        order_index: 1,
        theme_color: "#4CAF50",
        icon: "🌱",
        lessons: [
          {
            slug: "tables-and-basic-statistics",
            title: "Таблицы и базовые статистики",
            summary: "Учимся читать набор данных и извлекать из него простые числовые выводы.",
            theory_md: md(
              "# Первые шаги в аналитике",
              "",
              "Аналитика начинается с умения посмотреть на таблицу и понять, что в ней вообще происходит.",
              "",
              "Базовые статистики, фильтрация и аккуратное именование колонок помогают не потеряться даже в небольшом наборе данных.",
              "",
              "Этот урок подготавливает к pandas, визуализации и SQL-мышлению."
            ),
            estimated_minutes: 20,
            access_tier: "free",
            order_index: 1,
            tasks: [
              {
                slug: "average-score-python",
                title: "Посчитай средний балл",
                description_md: "Напиши функцию, которая возвращает среднее значение из списка чисел с округлением до двух знаков.",
                language: "python",
                difficulty: "beginner",
                starter_code: code(
                  "def average_score(values):",
                  "    # TODO: return average rounded to 2 decimals",
                  "    return 0",
                  "",
                  "print(average_score([5, 4, 3, 5]))"
                ),
                solution_template: null,
                max_hints: 3,
                access_tier: "free",
                estimated_minutes: 12,
                is_project_step: false,
                is_boss: false,
                visible_test_cases: [
                  {
                    kind: "stdout",
                    input_payload: "",
                    expected_output: "4.25",
                    weight: 1,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        title: "Basic Bay",
        difficulty: "basic",
        order_index: 2,
        theme_color: "#2196F3",
        icon: "📘",
        lessons: [
          {
            slug: "visualization-and-grouping",
            title: "Группировка данных и визуальные выводы",
            summary: "Собираем агрегаты и переводим сухие числа в понятные аналитические инсайты.",
            theory_md: md(
              "# От таблицы к инсайту",
              "",
              "Сама по себе таблица редко отвечает на продуктовый вопрос. Нужно сгруппировать данные, сравнить категории и увидеть выбросы.",
              "",
              "Визуализация полезна не только для красоты: она помогает объяснить вывод команде и клиенту.",
              "",
              "На базовом уровне важно научиться строить маленькие, но понятные аналитические истории."
            ),
            estimated_minutes: 25,
            access_tier: "free",
            order_index: 1,
            tasks: [
              {
                slug: "group-sales-python",
                title: "Сгруппируй продажи по категориям",
                description_md: "Верни словарь с суммой продаж по каждой категории.",
                language: "python",
                difficulty: "basic",
                starter_code: code(
                  "def group_sales(rows):",
                  "    # TODO: aggregate totals by category",
                  "    return {}",
                  "",
                  "sales = [",
                  "    {'category': 'books', 'amount': 120},",
                  "    {'category': 'books', 'amount': 80},",
                  "    {'category': 'courses', 'amount': 300},",
                  "]",
                  "print(group_sales(sales))"
                ),
                solution_template: null,
                max_hints: 3,
                access_tier: "free",
                estimated_minutes: 18,
                is_project_step: false,
                is_boss: false,
                visible_test_cases: [
                  {
                    kind: "stdout",
                    input_payload: "",
                    expected_output: "{'books': 200, 'courses': 300}",
                    weight: 1,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        title: "Intermediate Ridge",
        difficulty: "intermediate",
        order_index: 3,
        theme_color: "#FF9800",
        icon: "⚡",
        lessons: [
          {
            slug: "feature-preprocessing",
            title: "Нормализация и one-hot encoding",
            summary: "Готовим данные к модели: очищаем признаки и переводим категории в числовой формат.",
            theory_md: md(
              "# Подготовка признаков",
              "",
              "Качество модели сильно зависит от качества входных признаков.",
              "",
              "Нормализация выравнивает масштабы, а one-hot encoding превращает категории в форму, понятную алгоритмам.",
              "",
              "Этот этап одинаково важен и для аналитика, и для ML-специалиста."
            ),
            estimated_minutes: 30,
            access_tier: "premium",
            order_index: 1,
            tasks: [
              {
                slug: "normalize-values-python",
                title: "Нормализуй числовой столбец",
                description_md: "Реализуй min-max нормализацию для списка чисел. Для одинаковых значений возвращай список из нулей.",
                language: "python",
                difficulty: "intermediate",
                starter_code: code(
                  "def minmax_scale(values):",
                  "    # TODO: normalize values into range [0, 1]",
                  "    return []",
                  "",
                  "print(minmax_scale([10, 20, 30]))"
                ),
                solution_template: null,
                max_hints: 3,
                access_tier: "premium",
                estimated_minutes: 22,
                is_project_step: false,
                is_boss: false,
                visible_test_cases: [
                  {
                    kind: "stdout",
                    input_payload: "",
                    expected_output: "[0.0, 0.5, 1.0]",
                    weight: 1,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        title: "Advanced Citadel",
        difficulty: "advanced",
        order_index: 4,
        theme_color: "#9C27B0",
        icon: "👑",
        lessons: [
          {
            slug: "analytics-capstone",
            title: "Аналитический мини-проект по воронке обучения",
            summary: "Собираем законченную аналитическую задачу: считаем ключевые метрики и формируем выводы.",
            theory_md: md(
              "# Аналитический capstone",
              "",
              "На продвинутом уровне уже недостаточно просто посчитать метрику. Нужно объяснить, что она значит для продукта.",
              "",
              "Итоговый проект тренирует вычисление воронки, выявление проблемной зоны и формулировку короткой рекомендации.",
              "",
              "Такой артефакт хорошо смотрится в портфолио начинающего аналитика."
            ),
            estimated_minutes: 40,
            access_tier: "premium",
            order_index: 1,
            tasks: [
              {
                slug: "funnel-conversion-python",
                title: "Посчитай конверсию воронки",
                description_md: "Получив список этапов воронки, выведи процент конверсии между первым и последним этапом.",
                language: "python",
                difficulty: "advanced",
                starter_code: code(
                  "def funnel_conversion(stages):",
                  "    # TODO: return total conversion percent as integer",
                  "    return 0",
                  "",
                  "print(funnel_conversion([1000, 650, 260]))"
                ),
                solution_template: null,
                max_hints: 3,
                access_tier: "premium",
                estimated_minutes: 28,
                is_project_step: true,
                is_boss: true,
                visible_test_cases: [
                  {
                    kind: "stdout",
                    input_payload: "",
                    expected_output: "26",
                    weight: 1,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "javascript",
    title: "JavaScript",
    description: "Фронтенд-мышление, DOM, асинхронность и путь к современным интерфейсам.",
    category: "programming",
    is_premium: false,
    is_published: true,
    levels: [
      {
        title: "Beginner Island",
        difficulty: "beginner",
        order_index: 1,
        theme_color: "#4CAF50",
        icon: "🌱",
        lessons: [
          {
            slug: "syntax-and-functions",
            title: "Переменные, условия и функции",
            summary: "Стартуем с синтаксиса JavaScript и учимся управлять простыми сценариями в браузере.",
            theory_md: md(
              "# База JavaScript",
              "",
              "JavaScript отвечает за поведение веб-интерфейсов: клики, проверки форм, запросы и обновление контента.",
              "",
              "Сначала важно уверенно освоить переменные, функции и условные конструкции, а уже потом переходить к DOM и асинхронности.",
              "",
              "Этот урок создаёт основу для всего фронтенд-трека."
            ),
            estimated_minutes: 20,
            access_tier: "free",
            order_index: 1,
            tasks: [
              {
                slug: "greet-user-js",
                title: "Собери приветствие",
                description_md: "Реализуй функцию `greetUser`, которая возвращает строку `Hello, <name>!`.",
                language: "javascript",
                difficulty: "beginner",
                starter_code: code(
                  "function greetUser(name) {",
                  "  // TODO: return greeting",
                  "}",
                  "",
                  "console.log(greetUser('CodeNovsu'));"
                ),
                solution_template: null,
                max_hints: 3,
                access_tier: "free",
                estimated_minutes: 10,
                is_project_step: false,
                is_boss: false,
                visible_test_cases: [
                  {
                    kind: "stdout",
                    input_payload: "",
                    expected_output: "Hello, CodeNovsu!",
                    weight: 1,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        title: "Basic Bay",
        difficulty: "basic",
        order_index: 2,
        theme_color: "#2196F3",
        icon: "📘",
        lessons: [
          {
            slug: "dom-events-and-forms",
            title: "DOM, события и проверка форм",
            summary: "Учимся связывать код с интерфейсом: кнопки, поля ввода и реакция на действия пользователя.",
            theory_md: md(
              "# DOM и события",
              "",
              "DOM связывает HTML-структуру страницы с JavaScript-кодом.",
              "",
              "Базовый фронтенд-разработчик должен уверенно находить элементы, вешать обработчики и показывать пользователю понятный результат.",
              "",
              "Этот навык напрямую нужен для форм, модалок, фильтров и микроинтеракций."
            ),
            estimated_minutes: 25,
            access_tier: "free",
            order_index: 1,
            tasks: [
              {
                slug: "validate-login-js",
                title: "Проверь форму входа",
                description_md: "Напиши функцию `validateLogin`, которая возвращает `true`, если email содержит `@`, а пароль длиннее 7 символов.",
                language: "javascript",
                difficulty: "basic",
                starter_code: code(
                  "function validateLogin(email, password) {",
                  "  // TODO: validate login form",
                  "  return false;",
                  "}",
                  "",
                  "console.log(validateLogin('student@site.ru', 'strong123'));"
                ),
                solution_template: null,
                max_hints: 3,
                access_tier: "free",
                estimated_minutes: 15,
                is_project_step: false,
                is_boss: false,
                visible_test_cases: [
                  {
                    kind: "stdout",
                    input_payload: "",
                    expected_output: "true",
                    weight: 1,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        title: "Intermediate Ridge",
        difficulty: "intermediate",
        order_index: 3,
        theme_color: "#FF9800",
        icon: "⚡",
        lessons: [
          {
            slug: "async-and-fetch",
            title: "Асинхронность, fetch и состояние интерфейса",
            summary: "Разбираем промисы, async/await и работу с API без блокировки интерфейса.",
            theory_md: md(
              "# Асинхронный JavaScript",
              "",
              "Современный фронтенд постоянно общается с сервером, поэтому асинхронность — обязательный навык.",
              "",
              "Важно уметь запускать запрос, обрабатывать ошибку и обновлять состояние UI так, чтобы пользователь понимал, что происходит.",
              "",
              "Этот урок готовит к React, Next.js и реальным API."
            ),
            estimated_minutes: 30,
            access_tier: "premium",
            order_index: 1,
            tasks: [
              {
                slug: "map-api-result-js",
                title: "Преобразуй ответ API",
                description_md: "Реализуй функцию, которая принимает массив уроков и возвращает только названия опубликованных записей в верхнем регистре.",
                language: "javascript",
                difficulty: "intermediate",
                starter_code: code(
                  "function mapLessons(items) {",
                  "  // TODO: filter published and uppercase titles",
                  "  return [];",
                  "}",
                  "",
                  "const lessons = [",
                  "  { title: 'Intro', published: true },",
                  "  { title: 'Draft', published: false },",
                  "  { title: 'Loops', published: true },",
                  "];",
                  "console.log(mapLessons(lessons));"
                ),
                solution_template: null,
                max_hints: 3,
                access_tier: "premium",
                estimated_minutes: 20,
                is_project_step: false,
                is_boss: false,
                visible_test_cases: [
                  {
                    kind: "stdout",
                    input_payload: "",
                    expected_output: "['INTRO', 'LOOPS']",
                    weight: 1,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        title: "Advanced Citadel",
        difficulty: "advanced",
        order_index: 4,
        theme_color: "#9C27B0",
        icon: "👑",
        lessons: [
          {
            slug: "frontend-capstone",
            title: "Мини-проект: учебная страница трека",
            summary: "Собираем законченную страницу с карточками уроков, фильтрами и статусами прогресса.",
            theory_md: md(
              "# Проектный фронтенд",
              "",
              "Итоговая задача по JavaScript должна показать не только знание синтаксиса, но и понимание пользовательского сценария.",
              "",
              "Нужно продумать структуру данных, рендер карточек и читабельное состояние интерфейса для пользователя.",
              "",
              "Такой проект удобно развивать дальше уже в сторону React и Next.js."
            ),
            estimated_minutes: 40,
            access_tier: "premium",
            order_index: 1,
            tasks: [
              {
                slug: "render-track-cards-js",
                title: "Собери карточки уроков",
                description_md: "Заверши функцию, которая превращает список уроков в HTML-разметку карточек с названием и статусом.",
                language: "javascript",
                difficulty: "advanced",
                starter_code: code(
                  "function renderCards(items) {",
                  "  // TODO: return HTML string",
                  "  return '';",
                  "}",
                  "",
                  "const lessons = [",
                  "  { title: 'Intro', status: 'done' },",
                  "  { title: 'Loops', status: 'current' },",
                  "];",
                  "console.log(renderCards(lessons));"
                ),
                solution_template: null,
                max_hints: 3,
                access_tier: "premium",
                estimated_minutes: 30,
                is_project_step: true,
                is_boss: true,
                visible_test_cases: [
                  {
                    kind: "stdout",
                    input_payload: "",
                    expected_output: "<article",
                    weight: 1,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "ai-specialist",
    title: "AI Specialist",
    description: "Нейросети, подготовка данных, метрики и прикладные сценарии от перцептрона до трансформеров.",
    category: "ai",
    is_premium: true,
    is_published: true,
    levels: [
      {
        title: "Beginner Island",
        difficulty: "beginner",
        order_index: 1,
        theme_color: "#4CAF50",
        icon: "🌱",
        lessons: [
          {
            slug: "perceptron-basics",
            title: "Перцептрон и линейная классификация",
            summary: "Вводим ключевую идею нейросети на самом простом примере: веса, сумма и порог.",
            theory_md: md(
              "# Перцептрон",
              "",
              "Перцептрон — это удобная точка входа в мир нейросетей: у него мало компонентов, но он показывает главную идею модели.",
              "",
              "Мы складываем признаки с весами, применяем порог и получаем решение о классе.",
              "",
              "На этом фундаменте позже строятся более сложные архитектуры."
            ),
            estimated_minutes: 25,
            access_tier: "free",
            order_index: 1,
            tasks: [
              {
                slug: "point-classifier-python",
                title: "Классифицируй точку перцептроном",
                description_md: "Заверши функцию `predict_point`, которая возвращает `1`, если взвешенная сумма неотрицательна, иначе `0`.",
                language: "python",
                difficulty: "beginner",
                starter_code: code(
                  "def predict_point(x1, x2, w1, w2, bias):",
                  "    # TODO: compute weighted sum and threshold",
                  "    return 0",
                  "",
                  "print(predict_point(2, 1, 1, 1, -2))"
                ),
                solution_template: null,
                max_hints: 3,
                access_tier: "free",
                estimated_minutes: 15,
                is_project_step: false,
                is_boss: false,
                visible_test_cases: [
                  {
                    kind: "stdout",
                    input_payload: "",
                    expected_output: "1",
                    weight: 1,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        title: "Basic Bay",
        difficulty: "basic",
        order_index: 2,
        theme_color: "#2196F3",
        icon: "📘",
        lessons: [
          {
            slug: "preprocessing-and-metrics",
            title: "Предобработка данных и оценка качества",
            summary: "Учимся нормализовать признаки, кодировать категории и читать accuracy с confusion matrix.",
            theory_md: md(
              "# Подготовка данных и метрики",
              "",
              "Даже хорошая модель не спасёт плохой вход. Поэтому ещё до обучения важно подготовить признаки и выбрать понятную метрику.",
              "",
              "Accuracy даёт общий сигнал, а confusion matrix показывает, где именно модель ошибается.",
              "",
              "Это один из ключевых навыков для прикладного ML."
            ),
            estimated_minutes: 30,
            access_tier: "free",
            order_index: 1,
            tasks: [
              {
                slug: "accuracy-metric-python",
                title: "Посчитай accuracy",
                description_md: "Реализуй функцию, которая считает долю совпавших предсказаний и правильных ответов.",
                language: "python",
                difficulty: "basic",
                starter_code: code(
                  "def accuracy_score(y_true, y_pred):",
                  "    # TODO: calculate accuracy",
                  "    return 0",
                  "",
                  "print(accuracy_score([1, 0, 1, 1], [1, 1, 1, 0]))"
                ),
                solution_template: null,
                max_hints: 3,
                access_tier: "free",
                estimated_minutes: 18,
                is_project_step: false,
                is_boss: false,
                visible_test_cases: [
                  {
                    kind: "stdout",
                    input_payload: "",
                    expected_output: "0.5",
                    weight: 1,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        title: "Intermediate Ridge",
        difficulty: "intermediate",
        order_index: 3,
        theme_color: "#FF9800",
        icon: "⚡",
        lessons: [
          {
            slug: "mnist-dense-network",
            title: "Плотная нейросеть для распознавания цифр",
            summary: "Разбираем тренировочный цикл и структуру простой модели на задаче классификации изображений.",
            theory_md: md(
              "# Плотная сеть и обучение",
              "",
              "Когда студент уже понимает признаки и метрики, можно переходить к первой полноценной модели.",
              "",
              "На примере MNIST удобно объяснять батчи, эпохи, функцию потерь и роль валидации.",
              "",
              "Этот урок готовит к CNN и более сложным архитектурам."
            ),
            estimated_minutes: 35,
            access_tier: "premium",
            order_index: 1,
            tasks: [
              {
                slug: "batch-loss-python",
                title: "Вычисли среднюю loss по батчу",
                description_md: "Напиши функцию, которая принимает список значений функции потерь и возвращает среднее значение.",
                language: "python",
                difficulty: "intermediate",
                starter_code: code(
                  "def mean_loss(losses):",
                  "    # TODO: return average loss",
                  "    return 0",
                  "",
                  "print(mean_loss([0.9, 0.6, 0.3]))"
                ),
                solution_template: null,
                max_hints: 3,
                access_tier: "premium",
                estimated_minutes: 15,
                is_project_step: false,
                is_boss: false,
                visible_test_cases: [
                  {
                    kind: "stdout",
                    input_payload: "",
                    expected_output: "0.6",
                    weight: 1,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        title: "Advanced Citadel",
        difficulty: "advanced",
        order_index: 4,
        theme_color: "#9C27B0",
        icon: "👑",
        lessons: [
          {
            slug: "transformers-and-nlp",
            title: "Трансформеры и прикладной NLP",
            summary: "Понимаем, как устроены современные языковые модели и как готовить данные для fine-tuning.",
            theory_md: md(
              "# Трансформеры и NLP",
              "",
              "Трансформеры стали стандартом для задач работы с текстом благодаря механизму внимания и гибкости архитектуры.",
              "",
              "На практике важны не только слои модели, но и формат датасета, ограничения по стоимости и корректная оценка качества.",
              "",
              "Итоговая задача уровня связывает теорию модели и прикладной инженерный подход."
            ),
            estimated_minutes: 45,
            access_tier: "premium",
            order_index: 1,
            tasks: [
              {
                slug: "token-budget-python",
                title: "Оцени токенный бюджет датасета",
                description_md: "Реализуй функцию, которая суммирует количество токенов по списку документов и предупреждает, если лимит превышен.",
                language: "python",
                difficulty: "advanced",
                starter_code: code(
                  "def token_budget(lengths, limit):",
                  "    # TODO: return total and over_limit flag",
                  "    return 0, False",
                  "",
                  "print(token_budget([120, 80, 60], 250))"
                ),
                solution_template: null,
                max_hints: 3,
                access_tier: "premium",
                estimated_minutes: 25,
                is_project_step: true,
                is_boss: true,
                visible_test_cases: [
                  {
                    kind: "stdout",
                    input_payload: "",
                    expected_output: "(260, True)",
                    weight: 1,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "cybersecurity",
    title: "Cybersecurity for Developers",
    description: "Безопасная разработка, анализ уязвимостей и практики защиты веб‑ и backend‑систем.",
    category: "security",
    is_premium: true,
    is_published: true,
    levels: [
      {
        title: "Beginner Island",
        difficulty: "beginner",
        order_index: 1,
        theme_color: "#4CAF50",
        icon: "🌱",
        lessons: [
          {
            slug: "cipher-and-passwords",
            title: "Шифр Цезаря и надёжные пароли",
            summary: "Через простые упражнения понимаем базовые идеи защиты данных и проверки сложности.",
            theory_md: md(
              "# Первые шаги в кибербезопасности",
              "",
              "Старт лучше делать на понятных примерах: примитивное шифрование, базовые правила паролей и идея защиты пользовательских данных.",
              "",
              "Это помогает связать безопасность не с магией, а с конкретными инженерными решениями.",
              "",
              "Дальше на этой базе уже легче объяснять веб-угрозы и сетевую безопасность."
            ),
            estimated_minutes: 20,
            access_tier: "free",
            order_index: 1,
            tasks: [
              {
                slug: "password-strength-python",
                title: "Проверь сложность пароля",
                description_md: "Реализуй функцию, которая возвращает `strong`, если пароль длиннее 7 символов и содержит буквы и цифры, иначе `weak`.",
                language: "python",
                difficulty: "beginner",
                starter_code: code(
                  "def password_strength(password):",
                  "    # TODO: classify password as strong or weak",
                  "    return 'weak'",
                  "",
                  "print(password_strength('SafePass123'))"
                ),
                solution_template: null,
                max_hints: 3,
                access_tier: "free",
                estimated_minutes: 12,
                is_project_step: false,
                is_boss: false,
                visible_test_cases: [
                  {
                    kind: "stdout",
                    input_payload: "",
                    expected_output: "strong",
                    weight: 1,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        title: "Basic Bay",
        difficulty: "basic",
        order_index: 2,
        theme_color: "#2196F3",
        icon: "📘",
        lessons: [
          {
            slug: "web-vulnerabilities-basics",
            title: "SQL-инъекции, XSS и безопасный вывод",
            summary: "Разбираем популярные веб-уязвимости и учимся устранять их на уровне кода.",
            theory_md: md(
              "# Базовые веб-уязвимости",
              "",
              "SQL-инъекция и XSS остаются важными из-за того, что возникают в самых обычных пользовательских сценариях.",
              "",
              "Разработчику важно не просто узнать определение, а увидеть, где именно в коде появляется риск и как его убрать.",
              "",
              "В этом уроке мы тренируем привычку писать безопаснее по умолчанию."
            ),
            estimated_minutes: 30,
            access_tier: "free",
            order_index: 1,
            tasks: [
              {
                slug: "escape-html-js",
                title: "Экранируй пользовательский ввод",
                description_md: "Реализуй функцию `escapeHtml`, которая заменяет `<` и `>` на безопасные сущности.",
                language: "javascript",
                difficulty: "basic",
                starter_code: code(
                  "function escapeHtml(value) {",
                  "  // TODO: replace < and > with safe entities",
                  "  return value;",
                  "}",
                  "",
                  "console.log(escapeHtml('<script>alert(1)</script>'));"
                ),
                solution_template: null,
                max_hints: 3,
                access_tier: "free",
                estimated_minutes: 18,
                is_project_step: false,
                is_boss: false,
                visible_test_cases: [
                  {
                    kind: "stdout",
                    input_payload: "",
                    expected_output: "&lt;script&gt;alert(1)&lt;/script&gt;",
                    weight: 1,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        title: "Intermediate Ridge",
        difficulty: "intermediate",
        order_index: 3,
        theme_color: "#FF9800",
        icon: "⚡",
        lessons: [
          {
            slug: "logs-and-anomaly-analysis",
            title: "Анализ логов и поиск аномалий",
            summary: "Учимся читать журналы событий и находить сигналы атак и подозрительного поведения.",
            theory_md: md(
              "# Логи и инциденты",
              "",
              "Логи — один из самых практичных источников данных для безопасной разработки и расследования инцидентов.",
              "",
              "Даже простые эвристики помогают находить повторяющиеся ошибки, всплески запросов и необычные IP-адреса.",
              "",
              "Этот урок соединяет навыки безопасности и аналитического мышления."
            ),
            estimated_minutes: 35,
            access_tier: "premium",
            order_index: 1,
            tasks: [
              {
                slug: "detect-suspicious-ip-python",
                title: "Найди подозрительный IP",
                description_md: "Напиши функцию, которая возвращает IP-адрес, встретившийся в логе чаще остальных.",
                language: "python",
                difficulty: "intermediate",
                starter_code: code(
                  "def most_frequent_ip(entries):",
                  "    # TODO: return the most frequent ip",
                  "    return ''",
                  "",
                  "logs = ['10.0.0.1', '10.0.0.2', '10.0.0.1', '10.0.0.1']",
                  "print(most_frequent_ip(logs))"
                ),
                solution_template: null,
                max_hints: 3,
                access_tier: "premium",
                estimated_minutes: 20,
                is_project_step: false,
                is_boss: false,
                visible_test_cases: [
                  {
                    kind: "stdout",
                    input_payload: "",
                    expected_output: "10.0.0.1",
                    weight: 1,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        title: "Advanced Citadel",
        difficulty: "advanced",
        order_index: 4,
        theme_color: "#9C27B0",
        icon: "👑",
        lessons: [
          {
            slug: "secure-audit-capstone",
            title: "Итоговый аудит учебного веб-приложения",
            summary: "Собираем угрозы, проверки и рекомендации в один законченный security‑capstone.",
            theory_md: md(
              "# Security capstone",
              "",
              "Итоговый модуль имитирует реальный аудит: нужно увидеть риск, объяснить его и предложить конкретное исправление.",
              "",
              "Такой формат ценен тем, что соединяет знание уязвимостей с инженерной коммуникацией.",
              "",
              "Результат можно использовать как первый кейс в портфолио по AppSec."
            ),
            estimated_minutes: 45,
            access_tier: "premium",
            order_index: 1,
            tasks: [
              {
                slug: "security-report-python",
                title: "Сформируй краткий отчёт об аудите",
                description_md: "Заверши функцию, которая принимает список найденных рисков и печатает количество критичных и общее число замечаний.",
                language: "python",
                difficulty: "advanced",
                starter_code: code(
                  "def audit_summary(items):",
                  "    # TODO: print total and critical issues",
                  "    pass",
                  "",
                  "risks = [",
                  "    {'title': 'XSS', 'severity': 'high'},",
                  "    {'title': 'Weak password policy', 'severity': 'medium'},",
                  "    {'title': 'CSRF', 'severity': 'high'},",
                  "]",
                  "audit_summary(risks)"
                ),
                solution_template: null,
                max_hints: 3,
                access_tier: "premium",
                estimated_minutes: 25,
                is_project_step: true,
                is_boss: true,
                visible_test_cases: [
                  {
                    kind: "stdout",
                    input_payload: "",
                    expected_output: "Total: 3\nHigh severity: 2",
                    weight: 1,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];
