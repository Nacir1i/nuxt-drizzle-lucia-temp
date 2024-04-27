export default defineEventHandler(() => {
    const db = useDatabase();
    const config = useRuntimeConfig();

    return { config, db };
})
