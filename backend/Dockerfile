# Используем Node 18
FROM node:18

# Рабочая директория
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем весь проект
COPY . .

# Указываем порт
EXPOSE 3000

# Команда запуска
CMD ["npm", "start"]