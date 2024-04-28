import type { User } from "lucia";

export default defineNuxtRouteMiddleware(async () => {
  const { data: user } = await useFetch<User>("/api/user");
  if (!user.value) return navigateTo("/login");
});
