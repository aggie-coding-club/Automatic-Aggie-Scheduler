import { ThunkAction } from 'redux-thunk';
import {
  CourseCardOptions, SectionSelected, CustomizationLevel, SerializedCourseCardOptions,
  SectionFilter,
} from '../../types/CourseCardOptions';
import {
  AddCourseAction, ADD_COURSE_CARD, RemoveCourseAction, REMOVE_COURSE_CARD, UpdateCourseAction,
  UPDATE_COURSE_CARD, ClearCourseCardsAction, CLEAR_COURSE_CARDS, CourseCardAction,
} from '../reducers/courseCards';
import { RootState } from '../reducer';
import Meeting, { MeetingType } from '../../types/Meeting';
import Section, { InstructionalMethod } from '../../types/Section';
import Instructor from '../../types/Instructor';
import Grades from '../../types/Grades';
import sortMeeting from '../../utils/sortMeetingFunction';

function createEmptyCourseCard(): CourseCardOptions {
  return {
    course: '',
    customizationLevel: CustomizationLevel.BASIC,
    sections: [],
    remote: SectionFilter.NO_PREFERENCE,
    honors: SectionFilter.EXCLUDE,
    asynchronous: SectionFilter.NO_PREFERENCE,
    collapsed: false,
    disabled: false,
  };
}

export function addCourseCard(
  courseCard = createEmptyCourseCard(),
  idx: number = undefined,
): AddCourseAction {
  return {
    type: ADD_COURSE_CARD,
    courseCard,
    idx,
  };
}

export function removeCourseCard(index: number): RemoveCourseAction {
  return {
    type: REMOVE_COURSE_CARD,
    index,
  };
}

/**
   * Helper action creator that generates plain old UpdateCourseActions
   * @param index the index of the course card to update in the CourseCardArray
   * @param courseCard the options to update
   */
function updateCourseCardSync(index: number, courseCard: CourseCardOptions): UpdateCourseAction {
  return {
    type: UPDATE_COURSE_CARD,
    index,
    courseCard,
  };
}

/**
 * Helper function that converts the given serialized section from the backend and converts it
 * into a Section type
 * @param sectionData The serialized section returned from the backend, i.e. from /api/sections
 */
function parseSection(sectionData: any): Section {
  return new Section({
    id: Number(sectionData.id),
    crn: Number(sectionData.crn),
    subject: sectionData.subject,
    courseNum: sectionData.course_num,
    sectionNum: sectionData.section_num,
    minCredits: Number(sectionData.min_credits),
    maxCredits: Number(sectionData.max_credits) || null,
    currentEnrollment: Number(sectionData.current_enrollment),
    maxEnrollment: Number(sectionData.max_enrollment),
    honors: sectionData.honors,
    remote: sectionData.remote,
    asynchronous: sectionData.asynchronous,
    instructor: new Instructor({ name: sectionData.instructor_name }),
    grades: sectionData.grades == null ? null : new Grades(sectionData.grades),
    instructionalMethod: sectionData.instructional_method ?? InstructionalMethod.NONE,
  });
}

/**
 * Helper function that iterates through all of the meetings in single section given by the backend
 * and converts them into a Meeting's type array
 * @param sectionData The serialized section returned from the backend, i.e. from /api/sections
 * @param section The parsed Section type from this sectionData
 */
function parseMeetings(sectionData: any, section: Section): Meeting[] {
  return sectionData.meetings.map((meetingData: any) => {
    let start: string[] = ['0', '0'];
    let end: string[] = ['0', '0'];

    if (meetingData.start_time != null && meetingData.start_time.length > 0) {
      start = meetingData.start_time.split(':');
      end = meetingData.end_time.split(':');
    }

    const meeting = new Meeting({
      id: Number(meetingData.id),
      building: meetingData.building ?? '',
      meetingDays: meetingData.days,
      startTimeHours: Number(start[0]),
      startTimeMinutes: Number(start[1]),
      endTimeHours: Number(end[0]),
      endTimeMinutes: Number(end[1]),
      // Converts string to MeetingType enum
      meetingType: MeetingType[meetingData.type as keyof typeof MeetingType],
      section,
    });

    return meeting;
  });
}

/**
 * Helper function that iterates through all of the individual sections that are given by
 * /scheduler/generate, parses their meetings, then combines them into a singular Meeting array
 * Used in ConfigureCard for parsing the return from /scheduler/generate
 * @param arr The array of sections returne from the backend
 */
export function parseAllMeetings(arr: any[]): Meeting[] {
  const ret: Meeting[] = [];

  arr.forEach((sectionData) => {
    const section = parseSection(sectionData);

    const meetings = parseMeetings(sectionData, section);

    ret.push(...meetings);
  });

  return ret;
}

/**
 *  Helper function to parse the serialized Section model from the backend convert it into an
 *  array of Sections
 *  @param arr The array of sections returned from the backend, such as from api/sections
 */
export function parseSectionSelected(arr: any[]): SectionSelected[] {
  return arr.map((sectionData) => {
    const section = parseSection(sectionData);

    const meetings = parseMeetings(sectionData, section).sort(sortMeeting);

    return { section, meetings, selected: false };
  });
}

/**
 * Groups sections by professor and honors status, then sorts each group by the lowest section
 * number in the group, with TBA sections getting sorted to the bottom.
 * @param sections
 */
function sortSections(sections: SectionSelected[]): SectionSelected[] {
  // sort sections by sectionNum
  const sorted = sections.sort(
    (a, b) => a.section.sectionNum.localeCompare(b.section.sectionNum),
  );
  const sectionsForProfs: Map<string, SectionSelected[]> = new Map();
  // maps maintain key insertion order, so add all sections to map and remember order of professors
  const TBASections: SectionSelected[] = [];
  sorted.forEach((section) => {
    // H stands for honors, R stands for regular
    const instructorName = section.section.instructor.name + (section.section.honors ? 'H' : 'R');
    if (instructorName === 'TBAR') {
      TBASections.push(section);
    } else if (sectionsForProfs.has(instructorName)) {
      sectionsForProfs.get(instructorName).push(section);
    } else sectionsForProfs.set(instructorName, [section]);
  });
  // sections are now grouped by professor and sorted by section num
  return [].concat(...sectionsForProfs.values(), ...TBASections);
}

/**
 * Fetches sections for course in courseCard, then updates courseCard with new sections.
 * If the course card is invalid or sections can't be fetched, returns undefined.
 * @param courseCard course to get sections for
 * @param term term to fetch sections for
 */
async function fetchCourseCardFrom(
  courseCard: CourseCardOptions | SerializedCourseCardOptions,
  term: string,
): Promise<CourseCardOptions> {
  const [subject, courseNum] = courseCard.course?.split(' ') || ['', ''];
  return fetch(`/api/sections?dept=${subject}&course_num=${courseNum}&term=${term}`)
    .then((res) => res.json())
    .then(parseSectionSelected)
    .then(sortSections)
    .then((sections) => {
      const hasHonors = sections.some((section) => section.section.honors);
      const hasRemote = sections.some((section) => section.section.remote);
      const hasAsynchronous = sections.some((section) => section.section.asynchronous);
      // Update honors and web based on whether the old selection is still possible
      const honors = hasHonors ? courseCard.honors : SectionFilter.NO_PREFERENCE;
      const remote = hasRemote ? courseCard.remote : SectionFilter.NO_PREFERENCE;
      const asynchronous = hasAsynchronous ? courseCard.asynchronous : SectionFilter.NO_PREFERENCE;

      return {
        ...courseCard,
        sections,
        hasHonors,
        hasRemote,
        hasAsynchronous,
        honors,
        remote,
        asynchronous,
      };
    })
    .catch(() => undefined);
}

/**
   * Helper function that generates thunk-ified UpdateCourseActions after
   * fetching the new list of sections from the server
   * @param index the index of the course card to update in the CourseCardArray
   * @param courseCard the options to update
   */
function updateCourseCardAsync(
  index: number, courseCard: CourseCardOptions, term: string,
): ThunkAction<Promise<void>, RootState, undefined, UpdateCourseAction> {
  return (dispatch): Promise<void> => new Promise((resolve) => {
    fetchCourseCardFrom(courseCard, term).then((updatedCourseCard) => {
      if (updatedCourseCard) {
        dispatch(updateCourseCardSync(index, updatedCourseCard));
        resolve();
      }
    });
  });
}

/**
   * Publicly exposed action creator that generates thunk-ified UpdateCourseActions
   * for any arbitrary change to a course card's options
   * @param index the index of the course card to update in the CourseCardArray
   * @param courseCard the options to update
   */
export function updateCourseCard(index: number, courseCard: CourseCardOptions, term = ''):
    ThunkAction<void, RootState, undefined, CourseCardAction> {
  return (dispatch): void => {
    // if the course has changed, fetch new sections to display
    if (courseCard.course) {
      if (term === '') {
        throw Error('Term is empty string when passed to updateCourseCardAsync!');
      }
      dispatch(updateCourseCardSync(index, { course: courseCard.course, loading: true }));
      dispatch(updateCourseCardAsync(index, courseCard, term)).then(() => {
        dispatch(updateCourseCardSync(index, { loading: false }));
      });
    } else {
      dispatch(updateCourseCardSync(index, { ...courseCard, loading: false }));
    }
  };
}

export function toggleSelected(courseCardId: number, secIdx: number):
ThunkAction<void, RootState, undefined, UpdateCourseAction> {
  return (dispatch, getState): void => {
    dispatch(updateCourseCard(courseCardId, {
      sections: getState().courseCards[courseCardId].sections.map(
        (sec, idx) => (idx !== secIdx ? sec : {
          section: sec.section,
          selected: !sec.selected,
          meetings: sec.meetings,
        }),
      ),
    }));
  };
}

/**
  This function changes every section in a course card to be either selected or deselected
  @param courseCardId is the course card the change is targeting
  @param shouldSelect decides whether to select everything or deselect everything.
   (true: select all, false: deselect all)
*/
export function toggleSelectedAll(courseCardId: number, shouldSelect: boolean):
ThunkAction<void, RootState, undefined, UpdateCourseAction> {
  return (dispatch, getState): void => {
    dispatch(updateCourseCard(courseCardId, {
      sections: getState().courseCards[courseCardId].sections.map(
        (sec) => ({
          section: sec.section,
          selected: shouldSelect,
          meetings: sec.meetings,
        }),
      ),
    }));
  };
}


export function clearCourseCards(): ClearCourseCardsAction {
  return { type: CLEAR_COURSE_CARDS };
}

/**
 * Helper function to deserialize course card, doesn't keep selected sections.
 * Also note that this sets the card as loading until its sections are retrieved.
 * @param courseCard course card to update
 * @param term term to fetch sections for
 */
function deserializeCourseCard(courseCard: SerializedCourseCardOptions): CourseCardOptions {
  return {
    course: courseCard.course,
    customizationLevel: courseCard.customizationLevel,
    honors: courseCard.honors,
    remote: courseCard.remote,
    asynchronous: courseCard.asynchronous,
    collapsed: courseCard.collapsed ?? true,
    sections: [],
    loading: true,
    disabled: courseCard.disabled,
  };
}

function getSelectedSections(
  serialized: SerializedCourseCardOptions,
  courseCard: CourseCardOptions,
): SectionSelected[] {
  const selectedSections = new Set(serialized.sections);

  return courseCard?.sections?.map((section): SectionSelected => ({
    ...section,
    selected: selectedSections.has(section.section.id),
  })) || [];
}

/**
 * Fetches updated sections for each saved course card and replaces existing cards
 * @param courseCards Array of serialized course cards to update and replace existing cards
 * @param term Term to fetch section information from
 */
export function replaceCourseCards(
  courseCards: SerializedCourseCardOptions[],
  term: string,
): ThunkAction<void, RootState, undefined, CourseCardAction> {
  // data for sections might have changed since last visit, so create a new course card
  // for each one asynchronously and update them with data from courseCards
  return (dispatch, getState): void => {
    // if courseCards is improperly formatted or no cards are saved, simply finish loading
    if (!Array.isArray(courseCards) || courseCards.length === 0) {
      dispatch(updateCourseCardSync(0, { loading: false }));
      return;
    }

    // create course card from each serialized one, initially not fetching sections
    const deserializedCards: CourseCardOptions[] = [];
    courseCards.forEach((courseCard, idx) => {
      const deserializedCard = deserializeCourseCard(courseCard);
      deserializedCards.push(deserializedCard);
      dispatch(addCourseCard(deserializedCard, idx));
    });

    // all course cards are now marked as loading (preventing courses from being overwritten
    // if the page is closed), fetch sections
    deserializedCards.forEach((deserializedCard, idx) => {
      dispatch(updateCourseCardAsync(idx, deserializedCard, term)).then(() => {
        // after fetching sections, re-select sections from the serialized card and finish loading
        const updatedCard = getState().courseCards[idx];
        const cardWithSectionsSelected = {
          sections: getSelectedSections(courseCards[idx], updatedCard),
          loading: false,
        };
        dispatch(updateCourseCardSync(idx, cardWithSectionsSelected));
      });
    });
  };
}
