import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import { fileURLToPath, URL } from 'node:url';
import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

const packageJson = JSON.parse(
  readFileSync(new URL('./package.json', import.meta.url), 'utf-8')
);
const appVersion = packageJson.version || '0.0.0';

function getGitCommitSha(): string {
  if (process.env.VERCEL_GIT_COMMIT_SHA) {
    return process.env.VERCEL_GIT_COMMIT_SHA.slice(0, 7);
  }
  try {
    return execSync('git rev-parse --short HEAD', { encoding: 'utf-8' }).trim();
  } catch {
    return 'local';
  }
}

function getGitBranch(): string {
  if (process.env.VERCEL_GIT_COMMIT_REF) {
    return process.env.VERCEL_GIT_COMMIT_REF;
  }
  try {
    return execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf-8' }).trim();
  } catch {
    return 'develop';
  }
}

function resolveVersionDisplay(mode: string): string {
  const commitSha = getGitCommitSha();
  const vercelEnv = process.env.VERCEL_ENV;
  const branch = getGitBranch();

  if (vercelEnv === 'production' || (branch === 'main' && mode === 'production')) {
    return `v${appVersion}`;
  }

  if (vercelEnv === 'preview' || (branch === 'develop' && mode === 'production')) {
    return `v${appVersion}-rc (${commitSha})`;
  }

  return `v${appVersion}-dev (${commitSha})`;
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  define: {
    __APP_VERSION__: JSON.stringify(resolveVersionDisplay(mode)),
  },
  plugins: [
    TanStackRouterVite({
      autoCodeSplitting: true,
    }),
    react(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
  },
}));

