import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  try {
    const session = await auth.sesionActual();
    if (session) return true;
    router.navigate(['/login'], { replaceUrl: true });
    return false;
  } catch {
    router.navigate(['/login'], { replaceUrl: true });
    return false;
  }
};