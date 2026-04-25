import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { QuizService } from '../services/quiz.service';

export const resultsGuard: CanActivateFn = () => {
  const quiz = inject(QuizService);
  const router = inject(Router);
  if (quiz.queue().length > 0) return true;
  return router.createUrlTree(['/tests']);
};
