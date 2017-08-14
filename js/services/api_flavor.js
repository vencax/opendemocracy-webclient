
export function convertQuery (q) {
  let converted = {
    _page: q.page,
    _pagesize: q.perPage
  }
  if (q.sortField) {
    converted._sort = q.sortField
    converted._order = q.sortDir
  }
  for (let i in q.filters) {
    converted[i] = q.filters[i]
  }
  return converted
}

export function getTotalItems (response) {
  return parseInt(response.headers['x-total-count']) || response.data.length
}
