import * as React from 'react';
import { useSelector } from 'react-redux';
import * as styles from './ScheduleCard.css';
import DragHandle from './DragHandle';
import { RootState } from '../../../../redux/reducer';
import { AvailabilityArgs } from '../../../../types/Availability';
import { formatTime } from '../../../../utils/timeUtil';

let contentHeight: number = null;

interface BasicProps {
  startTimeHours: number;
  startTimeMinutes: number;
  endTimeHours: number;
  endTimeMinutes: number;
  borderColor?: string;
  backgroundColor?: string;
  backgroundStripes?: boolean;
  firstHour: number;
  lastHour: number;
  onResizeWindow?: (contentHeight: number, clientHeight: number) => void;
  onDragHandleDown?: (evt: React.MouseEvent<HTMLDivElement, MouseEvent>,
    endSelected: boolean) => void;
}

type ScheduleCardProps = React.PropsWithChildren<BasicProps>;

/**
 * Renders a generic card on the schedule. Currently used in the composition of
 * MeetingCard and AvailabilityCard
 * @param props include startTimeHours, startTimeMinutes, endTimeHours, endTimeMinutes,
  borderColor, backgroundColor, backgroundStripes, firstHour, lastHour, children,
  onResizeWindow, onDragHandleDown,
 */
const ScheduleCard: React.FC<ScheduleCardProps> = ({
  startTimeHours, startTimeMinutes, endTimeHours, endTimeMinutes,
  borderColor, backgroundColor, backgroundStripes, firstHour, lastHour, children,
  onResizeWindow, onDragHandleDown,
}) => {
  const selectedAvailabilities = useSelector<RootState, AvailabilityArgs[]>(
    (state) => state.selectedAvailabilities,
  );
  // tracks height of card and content, hiding meeting type if necessary
  const [isHovered, setHovered] = React.useState(false);
  const [isMouseDown, setMouseDown] = React.useState(selectedAvailabilities.length > 0);
  const cardRoot = React.useRef<HTMLDivElement>(null);
  const cardContent = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const handleResize = (): void => {
      // add up heights of children
      let currContentHeight = 0;
      for (let i = 0; i < cardContent.current.childElementCount; i++) {
        currContentHeight += cardContent.current.children[i].clientHeight;
      }
      // set initial height for future use
      contentHeight = contentHeight || currContentHeight;
      // notify the parent component
      const heightAvailable = cardContent.current.parentElement.clientHeight;
      onResizeWindow(contentHeight, heightAvailable);
    };

    // only attach the listener if the parent component cares to listen
    if (onResizeWindow) {
      handleResize();
      window.addEventListener('resize', handleResize);
      return (): void => window.removeEventListener('resize', handleResize);
    }
    // otherwise, there is no cleanup for this effect, so return empty function
    return (): void => {};
  }, [onResizeWindow]);
  // watch for when the user stops dragging this card
  if (selectedAvailabilities.length > 0 && isMouseDown) setMouseDown(false);

  const elapsedTime = endTimeHours * 60 + endTimeMinutes - startTimeHours * 60 - startTimeMinutes;
  const computedStyle: React.CSSProperties = {
    height: `calc(${elapsedTime / (lastHour - firstHour) / 60 * 100}% - 4px)`, // 2*2px margin
    top: `${(startTimeHours * 60 + startTimeMinutes - firstHour * 60) / (lastHour - firstHour) / 60 * 100}%`,
    background: backgroundStripes ? `repeating-linear-gradient(-45deg, ${
      backgroundColor}, ${backgroundColor} 5px, white 5px, white 20px)` : undefined,
    backgroundColor: backgroundStripes ? undefined : backgroundColor,
    border: `2px solid ${borderColor || backgroundColor}`,
    zIndex: onDragHandleDown ? 4 : 3,
  };
  const timeLabelStyle = {
    borderColor,
    display: isHovered || isMouseDown ? 'block' : 'none',
  };

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className={styles.scheduleCard}
      style={computedStyle}
      ref={cardRoot}
      onMouseEnter={(): void => setHovered(true)}
      onMouseLeave={(): void => setHovered(false)}
      onMouseDown={(e): void => {
        if (onDragHandleDown && e.target === e.currentTarget) e.stopPropagation();
      }}
    >
      <div className={styles.startTime} style={timeLabelStyle}>
        {`${formatTime(startTimeHours, startTimeMinutes)}`}
      </div>
      {onDragHandleDown
        ? (
          <DragHandle
            top
            onMouseDown={(evt): void => {
              setMouseDown(true);
              onDragHandleDown(evt, false);
            }}
            time={startTimeHours * 60 + startTimeMinutes}
          />
        )
        : null}
      <div ref={cardContent} className={styles.invisibleDiv}>
        {children}
      </div>
      {onDragHandleDown
        ? (
          <DragHandle
            bot
            onMouseDown={(evt): void => {
              setMouseDown(true);
              onDragHandleDown(evt, true);
            }}
            time={endTimeHours * 60 + endTimeMinutes}
          />
        )
        : null}
      <div className={styles.endTime} style={timeLabelStyle}>
        {`${formatTime(endTimeHours, endTimeMinutes)}`}
      </div>
    </div>
  );
};
export default ScheduleCard;
