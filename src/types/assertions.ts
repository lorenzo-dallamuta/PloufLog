export function IsDiveSiteWithNullId(diveSite: DiveSite | DiveSiteWithNullId): diveSite is DiveSiteWithNullId {
  return (typeof diveSite.data.properties.id === 'string') ? false : true
}