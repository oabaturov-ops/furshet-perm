# Рецепт: как из кода запечь контейнер furshet
FROM node:22-alpine
WORKDIR /app
# Заглушки для старых Supabase-модулей: при сборке им нужен адрес.
# Настоящие ключи в публичный репо не тащим — модули уедут при переделке.
ENV SUPABASE_URL=https://placeholder.supabase.co
ENV SUPABASE_ANON_KEY=placeholder-key
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
