export const getApiBase = () => {
  const runtimeConfig = useRuntimeConfig()
  return runtimeConfig.public.apiBase
}

