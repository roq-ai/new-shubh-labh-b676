const mapping: Record<string, string> = {
  banks: 'bank',
  customers: 'customer',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
