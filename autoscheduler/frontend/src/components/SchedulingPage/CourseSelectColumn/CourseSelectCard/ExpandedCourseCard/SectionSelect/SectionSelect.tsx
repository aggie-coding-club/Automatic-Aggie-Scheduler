import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  List, Typography, Checkbox,
} from '@material-ui/core';
import { ToggleButton } from '@material-ui/lab';
import { makeStyles } from '@material-ui/styles';
import { toggleSelectedAll } from '../../../../../../redux/actions/courseCards';
import { SectionSelected } from '../../../../../../types/CourseCardOptions';
import { RootState } from '../../../../../../redux/reducer';
import * as styles from './SectionSelect.css';
import SectionInfo from './SectionInfo';

interface SectionSelectProps {
  id: number;
}

const SectionSelect: React.FC<SectionSelectProps> = ({ id }): JSX.Element => {
  const sections = useSelector<RootState, SectionSelected[]>(
    (state) => state.courseCards[id].sections,
  );

  // for select all
  // override certain material ui styles
  const useStyles = makeStyles({
    rootToggleButton: {
      border: 'none',
      textAlign: 'left',
      margin: '5px 0',
      padding: '0 10px 0 0',
      fontSize: '86%',
      height: '35px',
      fontWeight: 500,
      color: 'rgba(0, 0, 0, 0.66)',
    },
    rootCheckbox: {
      padding: '0 3px 0 0',
    },
  });
  const classes = useStyles();
  // toggleSelectedAll
  const dispatch = useDispatch();

  // show placeholder text if there are no sections
  if (sections.length === 0) {
    return (
      <Typography className={styles.placeholderText} color="textSecondary" variant="body1">
        There are no available sections for this term
      </Typography>
    );
  }

  let numSelected = 0;
  /**
   * Makes a list of `SectionInfo` elements, one for each section of this course, by iterating over
   * each section in `sections`. As it iterates, this function groups consecutive sections with the
   * same professor and honors status together inside one `<ul>` and under one header. Having them
   * all inside the same `<ul>` is important in order to get smooth transitions with sticky headers.
   */
  const makeList = (): JSX.Element[] => {
    let lastProf: string = null;
    let lastHonors = false;
    let currProfGroupStart = 0;
    return sections.map((sectionData, secIdx) => {
      const firstInProfGroup = lastProf !== sectionData.section.instructor.name
        || lastHonors !== sectionData.section.honors;
      if (firstInProfGroup) currProfGroupStart = secIdx;

      lastProf = sectionData.section.instructor.name;
      lastHonors = sectionData.section.honors;
      numSelected += (sectionData.selected ? 1 : 0);

      const lastInProfGroup = lastProf !== sections[secIdx + 1]?.section.instructor.name
        || lastHonors !== sections[secIdx + 1]?.section.honors;

      // all sections in a group will be added at the same time
      if (!lastInProfGroup) return null;

      return (
        <ul key={lastProf + lastHonors} className={styles.noStartPadding}>
          {sections.slice(currProfGroupStart, secIdx + 1).map((iterSecData, offset) => (
            <SectionInfo
              secIdx={currProfGroupStart + offset}
              courseCardId={id}
              sectionData={iterSecData}
              addInstructorLabel={offset === 0}
              isLastSection={currProfGroupStart + offset === secIdx}
              key={iterSecData.section.id}
            />
          ))}
        </ul>
      );
    });
  };

  // pre-making list so we can tell if the select-all checkbox should be checked
  const list = makeList();
  const allSelected: boolean = numSelected === sections.length;
  const sectionSelectOptions = (
    <div>
      <ToggleButton classes={{ root: classes.rootToggleButton }} value="select-all" aria-label="select all" onChange={(): void => { dispatch(toggleSelectedAll(id, !allSelected)); }}>
        <Checkbox
          checked={allSelected}
          value={(allSelected) ? 'allOn' : 'allOff'}
          color="primary"
          size="small"
          disableRipple
          classes={{ root: classes.rootCheckbox }}
        />
          SELECT ALL
      </ToggleButton>
    </div>
  );

  return (
    <>
      {sectionSelectOptions}
      <List disablePadding className={styles.sectionRows}>
        {list}
      </List>
    </>
  );
};

export default SectionSelect;
