import { createServer } from 'vite'

export async function createViteServer() {
  const viteConfig = resolveViteConfig()

  console.log(viteConfig, createServer)
}

function resolveViteConfig() {}
