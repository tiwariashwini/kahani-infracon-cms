{
  "name": "kahani-infracon-cms",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "concurrently \"npm:dev:server\" \"npm:dev:client\"",
    "dev:client": "vite --host 0.0.0.0",
    "dev:server": "node --watch server/index.js",
    "build": "vite build",
    "preview": "vite preview --host 0.0.0.0",
    "start": "NODE_ENV=production node server/index.js",
    "db:init": "node server/index.js --init-only",
    "db:seed": "node server/index.js --seed-only"
  },
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "jsonwebtoken": "^9.0.2",
    "pg": "^8.12.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.1",
    "concurrently": "^9.0.1",
    "vite": "^5.4.11"
  }
}
