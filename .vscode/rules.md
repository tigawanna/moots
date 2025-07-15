This is a react native expo app using typescript
- react native paper for theming and components , adhere to `useTheme` and restrain from inlining colors unless absolutely necessary
- react native svg for icons and svgs, use `react-native-svg` package
- react query for data fetching and caching, use `useQuery` and `useMutation` with query options centralized in `lib/tanstack/**` the query key prefixes should be stored in `src/lib/tanstack/client.ts` in this object 

```ts
export const queryKeyPrefixes = {
  viewer: "viewer",
} as const
```
- zod for validation schemas, use `z.object({...})` for defining schemas and `zodResolver` from `@hookform/resolvers/zod` for integrating with forms
- react hook form for forms, use `useForm` and `Controller` from `react-hook-form`, ensure to use `zod` for validation schemas
- appwrite for backend services, use the `appwrite` package for client-side operations, ensure to use the correct client instance from `src/lib/appwrite/client.ts`
