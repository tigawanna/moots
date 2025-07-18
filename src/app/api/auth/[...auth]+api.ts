// import { auth } from "../../../../lib/auth"; // import Better Auth handler

// eslint-disable-next-line import/no-unresolved
import { auth } from "@/better-auth/auth"; // import Better Auth handler


const handler = auth.handler;
export { handler as GET, handler as POST }; 
