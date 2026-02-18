# ===================================================
# Stage 1: Build Docusaurus static site
# ===================================================
FROM node:20 AS builder
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy source and config
COPY docs ./docs
COPY blog ./blog
COPY src ./src
COPY static ./static
COPY docusaurus.config.ts sidebars.ts tsconfig.json ./

# Build-time URL for canonical links and sitemap
ENV SITE_URL=https://doc.polisportivacastelvieto.it
RUN npm run build

# ===================================================
# Stage 2: Serve with nginx
# ===================================================
FROM nginx:alpine
# Copy built site from builder
COPY --from=builder /app/build /usr/share/nginx/html
# Custom nginx config
COPY .deploy/build/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
