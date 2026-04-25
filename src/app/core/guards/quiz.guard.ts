import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { QuizService } from '../services/quiz.service';

export const quizGuard: CanActivateFn = () => {
  const quiz = inject(QuizService);
  const router = inject(Router);
  if (quiz.sessionState()) return true;
  return router.createUrlTree(['/tests']);
};
