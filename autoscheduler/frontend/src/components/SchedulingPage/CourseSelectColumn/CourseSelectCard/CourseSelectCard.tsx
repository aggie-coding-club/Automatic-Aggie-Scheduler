import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import RemoveIcon from '@material-ui/icons/Delete';
import CollapseIcon from '@material-ui/icons/ExpandLess';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {
  TextField, ButtonGroup, Button, FormLabel, Card, Typography, Collapse, Switch,
} from '@material-ui/core';
import { RootState } from '../../../../redux/reducer';
import { updateCourseCard, removeCourseCard } from '../../../../redux/actions/courseCards';


import * as styles from './ExpandedCourseCard/ExpandedCourseCard.css';
import * as parentStyles from '../CourseSelectColumn.css';
import * as childStyles from './ExpandedCourseCard/SectionSelect/SectionSelect.css';
import SectionSelect from './ExpandedCourseCard/SectionSelect/SectionSelect';
import BasicSelect from './ExpandedCourseCard/BasicSelect/BasicSelect';
import { CustomizationLevel, CourseCardOptions } from '../../../../types/CourseCardOptions';


import SmallFastProgress from '../../../SmallFastProgress';
import { getDisabledCourseCardColor } from '../../../../theme';

interface CourseSelectCardProps {
  id: number;
}

const CourseSelectCard: React.FC<CourseSelectCardProps> = ({ id }) => {
  const dispatch = useDispatch();
  const term = useSelector<RootState, string>((state) => state.term);
  const collapsed = useSelector<RootState, boolean>((state) => state.courseCards[id].collapsed);
  const {
    course, customizationLevel, loading, disabled,
  } = useSelector<RootState, CourseCardOptions>(
    (state) => state.courseCards[id],
  );

  const [options, setOptions] = React.useState([]);
  const [inputValue, setInputValue] = React.useState('');

  const toggleCollapsed = (): void => {
    dispatch(updateCourseCard(id, { collapsed: !collapsed }));
  };

  const header = (
    <div
      className={styles.header}
      onClick={toggleCollapsed}
      role="button"
      tabIndex={0}
      onKeyPress={toggleCollapsed}
      style={{
        backgroundColor: getDisabledCourseCardColor(disabled),
      }}
      data-testid="card-header"
    >
      <div
        className={styles.headerGroup}
        onClick={(evt): void => {
          dispatch(removeCourseCard(id));
          evt.stopPropagation();
        }}
        role="button"
        tabIndex={0}
        onKeyPress={(evt): void => {
          dispatch(removeCourseCard(id));
          evt.stopPropagation();
        }}
        aria-label="Remove"
      >
        <RemoveIcon />
      </div>
      <span className={styles.course}>{collapsed && (course || 'No Course Selected')}</span>
      <div className={styles.rightHeaderGroup}>
        {!collapsed && 'Include in schedule'}
        <Switch
          aria-label="Disable"
          checked={!disabled}
          onClick={(evt): void => {
            dispatch(updateCourseCard(id, { disabled: !disabled }));
            evt.stopPropagation();
          }}
        />
        <div className={styles.headerGroup}>
          <CollapseIcon
            classes={{ root: styles.rotatableIcon }}
            style={{
              transform: collapsed ? '' : 'rotate(180deg)',
            }}
          />
        </div>
      </div>
    </div>
  );

  const contentRef = React.useRef<HTMLDivElement>(null);
  /**
   * Fixes the height of the sectionRows element.
   *
   * Before this function is called, sectionRows will expand to fit every single one of its
   * sections. This function measures the height of the parent row and sets the height of
   * sectionRows to the height of the row minus 182 (the height of the rest of the row)
   */
  const fixHeight = React.useCallback((): void => {
    // find the expandedRow that is the parent of this card
    let parentEl = contentRef.current?.parentElement;
    while (parentEl
      && !parentEl.classList.contains(parentStyles.expandedRow)) {
      // if this card is in an expandedRowSmall, we'll need to re-calculate the height later,
      // once the class has been changed to expandedRow and the overflow-y is hidden
      if (parentEl.classList.contains(parentStyles.expandedRowSmall)) {
        const observer = new MutationObserver((mutations) => {
          observer.disconnect();
          if (mutations[0].attributeName === 'class') {
            fixHeight();
          }
        });

        observer.observe(parentEl, { attributes: true });
        return;
      }
      // if the current parentEl points to an element that is neither expandedRow nor
      // expandedRowSmall, keep looking
      parentEl = parentEl.parentElement;
    }
    // not all cards are currently in expanded rows
    if (parentEl) {
      // but for those that are, set the height in pixels so that it doesn't overflow
      const sectionRows = contentRef.current
        .getElementsByClassName(childStyles.sectionRows)[0] as HTMLElement;
      if (sectionRows) {
        // 217 is experimentally measured from the total height of the card content minus
        // the height of the sectionRows. Will need to be updated as card content changes
        sectionRows.style.height = `${parentEl.scrollHeight - 217}px`;
      }
    }
  }, []);

  function getAutocomplete(text: string): void {
    fetch(`api/course/search?search=${text}&term=${term}`).then(
      (res) => res.json(),
    ).then((result) => {
      if (result.results) {
        setOptions(result.results);
      }
    });
  }

  // determine customization content based on whether the card is loading and customization level
  const getCustomizationContent = (): JSX.Element => {
    // show loading if we're not sure what sections are available
    if (loading) {
      return (
        <div id={styles.centerProgress}>
          <SmallFastProgress />
          Loading sections...
        </div>
      );
    }

    const showBasic = customizationLevel === CustomizationLevel.BASIC;
    const showSection = customizationLevel === CustomizationLevel.SECTION && course;
    const showHint = customizationLevel === CustomizationLevel.SECTION && !course;
    return (
      <>
        <div style={{ display: showBasic ? 'block' : 'none' }}>
          <BasicSelect id={id} />
        </div>
        <div style={{ display: showSection ? 'contents' : 'none' }}>
          <SectionSelect id={id} onMounted={fixHeight} />
        </div>
        <div style={{ display: showHint ? 'block' : 'none' }}>
          <Typography color="textSecondary">
            Select a course to show available sections
          </Typography>
        </div>
      </>
    );
  };

  const collapsibleContent = (
    <Collapse in={!collapsed} onEntered={fixHeight}>
      <div className={styles.content} ref={contentRef} aria-hidden={collapsed}>
        <Autocomplete
          options={options}
          size="small"
          autoHighlight
          autoSelect
          disabled={loading}
          inputValue={inputValue}
          value={course}
          multiple={false}
          filterOptions={(): any[] => options} // Options are not filtered
          getOptionSelected={(option): boolean => option === options[0]}
          onClose={(): void => {
            if (options.length === 0) setInputValue('');
          }}
          onChange={(_evt: object, val: string): void => {
            dispatch(updateCourseCard(id, {
              course: val,
            }, term));
          }}
          onInputChange={(_evt: object, val: string, reason: string): void => {
            setInputValue(val);
            if (val === '') { // Skip empty inputs
              setOptions([]); // Clear the autocomplete options so previous results don't show
              return;
            }

            if (reason !== 'reset') getAutocomplete(val);
          }}
          renderInput={(params: any): JSX.Element => (
            // eslint-disable-next-line react/jsx-props-no-spreading
            <TextField {...params} label="Course" fullWidth autoFocus variant="outlined" />
          )}
          classes={{ root: styles.courseInput }}
        />
        <FormLabel component="label" style={{ marginTop: 16 }} focused={false}>
          Customization Level:
        </FormLabel>
        <ButtonGroup className={styles.customizationButtons}>
          <Button
            className={styles.noElevation}
            color="primary"
            variant={customizationLevel === CustomizationLevel.BASIC ? 'contained' : 'outlined'}
            onClick={(): void => {
              dispatch(updateCourseCard(id, {
                customizationLevel: CustomizationLevel.BASIC,
              }));
            }}
          >
            Basic
          </Button>
          <Button
            className={styles.noElevation}
            color="primary"
            variant={customizationLevel === CustomizationLevel.SECTION ? 'contained' : 'outlined'}
            onClick={(): void => {
              dispatch(updateCourseCard(id, {
                customizationLevel: CustomizationLevel.SECTION,
              }));
            }}
          >
            Section
          </Button>
        </ButtonGroup>
        {getCustomizationContent()}
      </div>
    </Collapse>
  );

  return (
    <Card className={styles.card}>
      {header}
      {collapsibleContent}
    </Card>
  );
};

export default CourseSelectCard;
