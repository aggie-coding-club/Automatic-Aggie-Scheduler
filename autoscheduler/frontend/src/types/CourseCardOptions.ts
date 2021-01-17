/* eslint-disable import/prefer-default-export */
import Section from './Section';
import Meeting from './Meeting';

export enum CustomizationLevel {
  BASIC, SECTION
}

export enum SectionFilter {
  NO_PREFERENCE = 'no_preference',
  EXCLUDE = 'exclude',
  ONLY = 'only',
}

/**
 * Represents a section, its meetings, and whether or not the section
 * is curently selected
 */
export interface SectionSelected {
  section: Section;
  meetings: Meeting[];
  selected: boolean;
}

export interface CourseCardOptions {
  course?: string;
  customizationLevel?: CustomizationLevel;
  remote?: string;
  honors?: string;
  asynchronous?: string;
  hasHonors?: boolean;
  hasRemote? : boolean;
  hasAsynchronous?: boolean;
  sections?: SectionSelected[];
  loading?: boolean;
  collapsed?: boolean;
  disabled?: boolean;
}

// Represents a course card when saved and serialized, sections are saved as strings
// to save space
export interface SerializedCourseCardOptions {
  course?: string;
  customizationLevel?: CustomizationLevel;
  remote?: string;
  honors?: string;
  asynchronous?: string;
  sections?: number[];
  collapsed?: boolean;
  disabled?: boolean;
}

/**
 * Represents all course cards currently in existence
 */
export interface CourseCardArray {
  [index: number]: CourseCardOptions;
  /**
   * The number of cards created at this point in time is 1 more than the largest
   * possible index for any card in the array. numCardsCreated should NOT be used
   * to determine the number of cards currently in existence, as removing cards does
   * not decrement numCardsCreated
   */
  numCardsCreated: number;
}
