import { AbstractControl, ValidationErrors } from '@angular/forms';

const bannedWords = ['badword', 'ugly', 'nasty'];

export function noProfanity(control: AbstractControl): ValidationErrors | null {
  const value = control.value?.toLowerCase();
  const hasProfanity = bannedWords.some(word => value?.includes(word));
  return hasProfanity ? { profanity: 'Inappropriate content detected' } : null;
}
