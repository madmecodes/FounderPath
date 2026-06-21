// ---------- Curriculum domain model ----------

export type QuestionType = "mcq" | "truefalse" | "calc";

export interface Question {
  id: string;
  type: QuestionType;
  /** The prompt shown to the player. */
  prompt: string;
  /** Answer options. For truefalse use ["True","False"]. */
  options: string[];
  /** Index into options of the correct answer. */
  correct: number;
  /** Shown after answering — teaches the concept regardless of right/wrong. */
  explanation: string;
  /** Optional short hint the player can reveal (costs nothing, just help). */
  hint?: string;
  /** Optional concept tag for review. */
  concept?: string;
}

export interface Lesson {
  id: string;
  title: string;
  /** Markdown-ish plain text paragraphs (rendered as blocks). */
  blocks: LessonBlock[];
}

export type LessonBlock =
  | { kind: "p"; text: string }
  | { kind: "callout"; tone: "info" | "warn" | "key"; title: string; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "compare"; left: { title: string; items: string[] }; right: { title: string; items: string[] } }
  | { kind: "formula"; label: string; formula: string; note?: string };

/** A growth path the player can choose in the branching world. */
export interface GrowthPath {
  id: string;
  name: string;
  blurb: string;
  emoji: string;
  lessons: Lesson[];
  questions: Question[];
}

export interface World {
  id: string;
  index: number;
  title: string;
  /** Short subtitle shown on the map node. */
  subtitle: string;
  /** One-line learning objective. */
  objective: string;
  /** Emoji / icon used when no image asset is present. */
  icon: string;
  /** Asset path (pixel art) relative to /public, optional. */
  asset?: string;
  /** Accent color key for theming the world. */
  accent: "gold" | "sky" | "quest" | "ember" | "heart";
  lessons: Lesson[];
  questions: Question[];
  /** If set, this world is a branching choice between growth paths. */
  branching?: GrowthPath[];
  /** XP awarded for clearing the world (computed if absent). */
  xpReward?: number;
}

// ---------- Player progress (persisted to localStorage) ----------

export interface WorldProgress {
  /** Best score 0..1 the player has achieved on the quiz. */
  best: number;
  completed: boolean;
  /** Chosen growth path id, only for the branching world. */
  chosenPath?: string;
  /** Per-question: was it ever answered correctly. */
  mastered: string[];
}

export interface PlayerState {
  name: string;
  xp: number;
  hearts: number;
  /** ISO date of last play, for streak. */
  lastPlayed?: string;
  streak: number;
  worlds: Record<string, WorldProgress>;
  /** Earned badge ids. */
  badges: string[];
  /** Onboarding complete. */
  onboarded: boolean;
  /** Seen the one-time "what kind of startup" intro. */
  introSeen?: boolean;
}
