export const getEnvVariables = () => {
    import.meta.env;  // Comentar en produccion

    return {
        ...import.meta.env
    }
}