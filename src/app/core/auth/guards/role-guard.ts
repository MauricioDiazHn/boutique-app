import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AppStore } from '../../state/app.store';

export const roleGuard: CanActivateFn = (route, state) => {
  const store = inject(AppStore);
  const router = inject(Router);

  const requiredRoles = route.data['roles'] as string[] | undefined;

  // 1. Check for authentication
  if (!store.isAuthenticated()) {
    // Redirect to login page if not authenticated
    router.navigate(['/auth']);
    return false;
  }

  // 2. If no roles are required for the route, allow access
  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }

  // 3. Check for role authorization
  const userRole = store.userRole();
  if (!userRole || !requiredRoles.includes(userRole)) {
    // If user has no role or their role is not in the required list, redirect
    router.navigate(['/sales']); // Or a dedicated 'unauthorized' page
    return false;
  }
  return true;
};
