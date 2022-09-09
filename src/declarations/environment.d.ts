declare global {
  namespace NodeJS {
    interface ProcessEnv {
      BUFFER_PATH: string;
      DISCORD_ID: string;
      DISCORD_SECRET: string;
      REDIRECT_URI: string;
    }
  }
}

export {};
