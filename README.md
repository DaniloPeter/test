# Full-Stack Testing Application

## Описание

Фулл-стек приложение для тестирования

### Backend:

- **Node.js**: Серверная платформа.
- **Express**: Фреймворк для создания REST API.
- **Sequelize**: ORM для работы с MySQL.
- **MySQL**: Реляционная база данных.

### Frontend:

- **React**: Библиотека для создания пользовательского интерфейса.
- **Axios**: HTTP-клиент для запросов к API.

### Дополнительно:

- **CORS**: Для разрешения кросс-доменных запросов.
- **bcrypt**: Для хеширования паролей (если потребуется).
- **Navicat**: Для работы с базами данных.

---

## Установка и запуск

### 1. Предварительные требования

Убедитесь, что у вас установлены:

- [Node.js](https://nodejs.org/) (версия 16+)
- [MySQL](https://www.mysql.com/) (версия 8+ или другая СУБД, если вы хотите изменить конфигурацию)

### 2. Настройка бэкенда

1. Перейдите в папку `backend`:

   ```bash
   cd backend
   ```

2. Установите зависимости:

   ```bash
   npm install
   ```

3. Настройте подключение к базе данных:

   - Откройте файл `config/config.json` и укажите свои данные:
     ```json
     {
       "development": {
         "username": "root",
         "password": "ваш_пароль",
         "database": "test_db",
         "host": "localhost",
         "dialect": "mysql"
       }
     }
     ```

4. Выполните миграции и seeds:

   ```bash
   npx sequelize-cli db:create
   npx sequelize-cli db:migrate
   npx sequelize-cli db:seed:all
   ```

5. Запустите сервер:
   ```bash
   node server.js
   ```

### 3. Настройка фронтенда

1. Перейдите в папку `frontend`:

   ```bash
   cd ../frontend
   ```

2. Установите зависимости:

   ```bash
   npm install
   ```

3. Запустите React-приложение:

   ```bash
   npm start
   ```

4. Откройте браузер по адресу:  
   [http://localhost:3000](http://localhost:3000)

---

## Структура проекта

```
fullstack-hello-world/
├── backend/
│   ├── config/          # Конфигурация Sequelize
│   ├── migrations/      # Миграции базы данных
│   ├── models/          # Модели Sequelize
│   ├── seeders/         # Seeds для начальных данных
│   ├── package.json     # Зависимости бэкенда
│   └── server.js        # Основной файл сервера
├── frontend/
│   ├── public/          # Статические файлы
│   ├── src/             # Исходный код фронтенда
│   │   └── App.js       # Главный компонент React
│   └── package.json     # Зависимости фронтенда
│
└── README.md        # Документация фронтенда
```

---
