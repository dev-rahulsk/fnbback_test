// env.d.ts
declare namespace NodeJS {
    interface ProcessEnv {
      MONGO_URL: string;
      PORT?: string; // Optional
      SMTP_PORT:string;
      HOST_SERVICE:string;
      EMAIL_USER:string;
      EMAIL_PASS:string;
      NODE_ENV?: 'development' | 'production' | 'test'; // Optional
      // Add other environment variables here
    }
  }
  