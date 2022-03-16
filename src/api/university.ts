const API_BASE_URL = 'http://universities.hipolabs.com/search?'

interface UniversityResult {
  name: string
}

export const fetchNames = async (text: string) => {
  const response = await fetch(`${API_BASE_URL}name=${text}`)
  const data = await response.json()
  return data.map((item: UniversityResult) => item.name)
}
