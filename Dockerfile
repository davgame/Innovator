# ============================================
# СТАДИЯ 1: Сборка Vite-приложения
# ============================================
FROM node:22-alpine AS builder

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci

# Копируем все исходники
COPY . .

# Переменные для Vite (вшиваются в сборку)
ENV VITE_SUPABASE_URL=https://инноваторы.tech
ENV VITE_SUPABASE_ANON_KEY=sb_publishable_L7e1QC6qK062gNkGoQa3yK_sTSec_Xz

# Собираем проект (создает папку dist)
RUN npm run build

# ============================================
# СТАДИЯ 2: Nginx сервер
# ============================================
FROM nginx:alpine

# Копируем собранные файлы из стадии builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Копируем кастомный конфиг Nginx (если есть)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Открываем порт 80
EXPOSE 80

# Запускаем Nginx
CMD ["nginx", "-g", "daemon off;"]