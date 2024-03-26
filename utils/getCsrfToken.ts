export const getCsrfToken = async (baseUrl: string) => {
  try {
    const token = await fetch(`${baseUrl}/csrf`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
    const csrfToken = await token.json()
    return csrfToken
  } catch (error) {
    console.error(error)
  }
}
