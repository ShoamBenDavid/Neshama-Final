import type { Language } from '../i18n';
import type { BreathingExercise, MeditationSession, AudioTrack } from './types';
import { breathingExercises } from './breathingExercises';
import { breathingExercisesHE } from './breathingExercises.he';
import { meditationSessions } from './meditationScripts';
import { meditationSessionsHE } from './meditationScripts.he';
import { audioTracks } from './audioCategories';
import { audioTracksHE } from './audioCategories.he';

const breathingByLang: Record<Language, BreathingExercise[]> = {
  en: breathingExercises,
  he: breathingExercisesHE,
};

const meditationByLang: Record<Language, MeditationSession[]> = {
  en: meditationSessions,
  he: meditationSessionsHE,
};

const audioByLang: Record<Language, AudioTrack[]> = {
  en: audioTracks,
  he: audioTracksHE,
};

export function getBreathingExercises(lang: Language): BreathingExercise[] {
  return breathingByLang[lang] ?? breathingByLang.en;
}

export function getMeditationSessions(lang: Language): MeditationSession[] {
  return meditationByLang[lang] ?? meditationByLang.en;
}

export function getAudioTracks(lang: Language): AudioTrack[] {
  return audioByLang[lang] ?? audioByLang.en;
}

export function getBreathingExerciseById(
  id: string,
  lang: Language,
): BreathingExercise | undefined {
  return getBreathingExercises(lang).find((e) => e.id === id);
}

export function getMeditationSessionById(
  id: string,
  lang: Language,
): MeditationSession | undefined {
  return getMeditationSessions(lang).find((s) => s.id === id);
}

export function getAudioTrackById(
  id: string,
  lang: Language,
): AudioTrack | undefined {
  return getAudioTracks(lang).find((t) => t.id === id);
}
