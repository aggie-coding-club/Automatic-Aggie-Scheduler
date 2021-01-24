import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  ListItem, ListItemText, ListItemSecondaryAction, Button,
} from '@material-ui/core';
import selectSchedule from '../../../../redux/actions/selectedSchedule';
import Section from '../../../../types/Section';
import * as styles from '../SchedulePreview.css';
import ColorBox from './ColorBox';
import MiniSchedule from './MiniSchedule/MiniSchedule';
import useMeetingColor from '../../Schedule/meetingColors';
import SaveScheduleButton from './Buttons/SaveScheduleButton';
import DeleteScheduleButton from './Buttons/DeleteScheduleButton';
import { RootState } from '../../../../redux/reducer';
import Schedule from '../../../../types/Schedule';
import ScheduleName from './Buttons/ScheduleName';
import useDimensions from '../../../../hooks/useDimensions';
import sectionsForSchedule from '../../../../utils/sectionsForSchedule';

interface ScheduleListItemProps {
  index: number;
  onDetailsClick: (event: React.MouseEvent<HTMLElement>) => void;
}

const ScheduleListItem: React.FC<ScheduleListItemProps> = ({ index, onDetailsClick }) => {
  const dispatch = useDispatch();

  const schedule = useSelector<RootState, Schedule>((state) => (
    state.schedules[index]
  ));
  const selectedSchedule = useSelector<RootState, number>((state) => state.selectedSchedule);

  const meetingColors = useMeetingColor();

  // Dynamically create style for schedule name and buttons to position them properly
  // since absolute positioning must be used to place a button inside another button
  const scheduleNameRef = React.useRef(null);
  const nameDimensions = useDimensions(scheduleNameRef);

  const buttonContainerStyle: React.CSSProperties = {
    // Disable pointer events so that schedule name can be clicked through, it will be re-enabled
    // on each clickable element
    pointerEvents: 'none',
    // Determine proper positioning and width
    top: nameDimensions.top + (nameDimensions.height / 2),
    left: nameDimensions.left,
    maxWidth: nameDimensions.width,
  };

  const scheduleNameAndActions = (
    <ListItemSecondaryAction style={buttonContainerStyle}>
      <div className={styles.scheduleHeader}>
        <ScheduleName index={index} />
        <span className={`${styles.enablePointerEvents} ${styles.noFlexShrink}`}>
          <SaveScheduleButton index={index} />
          <DeleteScheduleButton index={index} />
        </span>
      </div>
    </ListItemSecondaryAction>
  );

  const scheduleSections = sectionsForSchedule(schedule).map((sec: Section) => {
    const color = sec.asynchronous ? undefined : meetingColors.get(sec.subject + sec.courseNum);

    return (
      <span key={sec.id} className={styles.sectionLabelRow}>
        <ColorBox color={color} />
        <span className={styles.sectionNum}>
          {`${sec.subject} ${sec.courseNum}-${sec.sectionNum}`}
        </span>
        <span className={styles.instructorName}>
          {sec.instructor.name}
        </span>
        <br />
      </span>
    );
  });

  const scheduleItemContent = (
    <span className={styles.scheduleContentContainer}>
      {scheduleSections}
    </span>
  );

  return (
    <ListItem
      button
      alignItems="flex-start"
      key={index}
      onClick={(): void => { dispatch(selectSchedule(index)); }}
      selected={selectedSchedule === index}
      classes={{ root: styles.listItemWithPreview }}
      // Having a ListItemSecondaryAction overrides the padding-right to 48px, which we don't want
      // The classes prop is injected before material ui classes, so style is used here instead
      style={{ paddingLeft: 8, paddingRight: 16 }}
      aria-label="Schedule preview"
    >
      <span className={styles.listItemContents}>
        <ListItemText
          className={styles.listItemTextContainer}
          primary={(
            <>
              {/* This element exists to reserve vertical space for the schedule name + buttons,
                  and is used  as a ref for where to place those components */}
              <div ref={scheduleNameRef}>
                <span className={styles.hidden}>
                  .
                </span>
              </div>
            </>
          )}
          secondary={scheduleItemContent}
          secondaryTypographyProps={{ className: styles.sectionContainer }}
        />
        <span className={styles.detailsButton}>
          <Button
            color="primary"
            size="small"
            variant="contained"
            onClick={(e): void => { e.stopPropagation(); onDetailsClick(e); }}
          >
            Details
          </Button>
        </span>
      </span>
      <MiniSchedule schedule={schedule.meetings} />
      {scheduleNameAndActions}
    </ListItem>
  );
};

export default ScheduleListItem;
