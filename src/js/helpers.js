/**
 *  AJAX call to API: POST OR GET, depending on uploadData param
 * @param {string} url
 * @param {object} uploadData
 * @returns {Promise<object>} data
 */
export const AJAX = async (url, uploadData = undefined) => {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(uploadData)
      })
      : fetch(url)
    const res = await fetchPro
    const data = await res.json()

    if (!res.ok) throw new Error(`${data.message} (${res.status})`)

    return data
  } catch (error) {
    console.error(error)
  }
}
