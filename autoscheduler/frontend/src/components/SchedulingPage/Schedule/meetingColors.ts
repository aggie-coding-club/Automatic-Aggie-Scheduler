import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/reducer';

export const colors = [
  '#f2c05b', // yellow
  '#2d683e', // green
  '#ec4631', // orange
  '#227d9c', // blue
  '#83205c', // purple
  '#db728e', // light brown/pink
  '#249889', // turquoise
  '#c82041', // red
  '#612b0d', // dark brown
];

export default function useMeetingColor(): Map<string, string> {
  const allSectionIds = new Set(useSelector<RootState, string[]>(
    (state) => state.schedules.reduce<string[]>(
      (arr, schedule) => arr.concat(
        schedule.meetings.map(
          (meeting) => meeting.section.subject + meeting.section.courseNum,
        ),
      ),
      [],
    ),
  ));

  const sectionToColor = new Map<string, string>();
  [...allSectionIds.keys()].forEach((courseName, idx) => {
    sectionToColor.set(courseName, colors[idx % colors.length]);
  });
  return sectionToColor;
}
