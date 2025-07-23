This is a react native expo app using typescript
- react native paper for theming and components , adhere to `useTheme` and restrain from inlining colors unless absolutely necessary
- pnpm for package management, use `pnpm install` to add new packages
- react native svg for icons and svgs, use `react-native-svg` package

- zod for validation schemas, use `z.object({...})` for defining schemas and `zodResolver` from `@hookform/resolvers/zod` for integrating with forms
- react hook form for forms, use `useForm` and `Controller` from `react-hook-form`, ensure to use `zod` for validation schemas

- with react query prefer createing `queryOptions` and or custom hooks to encapsulate logic
 - Do not nest a `Flatlist` in a `ScrollView`
    