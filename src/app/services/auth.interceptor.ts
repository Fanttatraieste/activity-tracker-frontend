import { HttpInterceptorFn } from '@angular/common/http';

/**
 * Interceptor HTTP bazat pe functii (standard Angular 17+).
 * Acesta monitorizeaza toate cererile de iesire si adauga Header-ul de autorizare.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Extragem token-ul JWT salvat in browser dupa logare
  const token = localStorage.getItem('authToken');

  // Daca token-ul exista, clonam cererea si ii adaugam header-ul 'Authorization'
  if (token) {
    const cloned = req.clone({
      setHeaders: {
        // Formatul standard 'Bearer <token>' pentru autentificarea JWT
        Authorization: `Bearer ${token}`
      }
    });

    // Trimitem cererea modificata (clonata) catre server
    return next(cloned);
  }

  // Daca nu avem token (ex: la Login), trimitem cererea originala nemodificata
  return next(req);
};
