import * as React from 'react';
import { Typography } from '@material-ui/core';
import * as styles from './MeetingCard.css';
import Meeting, { MeetingType } from '../../../../types/Meeting';
import ScheduleCard from '../ScheduleCard/ScheduleCard';

interface MeetingCardProps {
  meeting: Meeting;
  bgColor: string;
  firstHour: number;
  lastHour: number;
}

/**
 * Renders a meeting of a class on the schedule
 * @param props include meeting, bgColor, firstHour, and lastHour
 */
const MeetingCard: React.FC<MeetingCardProps> = ({
  meeting, bgColor, firstHour, lastHour,
}: MeetingCardProps) => {
  // destructure meeting for ease of access
  const {
    startTimeHours, startTimeMinutes, endTimeHours, endTimeMinutes, section, meetingType,
  } = meeting;
  const [isBig, setIsBig] = React.useState(true);

  // hide meeting type if the card is small
  const handleResize = React.useCallback((newVal: boolean): void => {
    setIsBig(newVal);
  }, []);

  return (
    <ScheduleCard
      startTimeHours={startTimeHours}
      startTimeMinutes={startTimeMinutes}
      endTimeHours={endTimeHours}
      endTimeMinutes={endTimeMinutes}
      firstHour={firstHour}
      lastHour={lastHour}
      onResizeWindow={
        (contentHeight, clientHeight): void => handleResize(contentHeight < clientHeight)
      }
      backgroundColor={bgColor}
      borderColor={bgColor}
    >
      <Typography variant="body2" data-testid="meeting-card-primary-content" className={styles.meetingCardText}>
        {`${section.subject} ${section.courseNum}`}
        {isBig
          ? `-${section.sectionNum}`
          : (
            <Typography variant="subtitle2" component="span">
              &nbsp;
              {`${MeetingType[meetingType]}`}
            </Typography>
          )}
      </Typography>
      <Typography variant="subtitle2" style={{ display: isBig ? 'block' : 'none' }}>
        {MeetingType[meetingType]}
      </Typography>
    </ScheduleCard>
  );
};

export default MeetingCard;
