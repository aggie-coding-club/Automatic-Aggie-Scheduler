import * as React from 'react';
import {
  Typography, FormLabel,
} from '@material-ui/core';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../../redux/reducer';
import * as styles from './BasicSelect.css';
import BasicOptionRow from './BasicOptionRow';
import BasicCheckbox from './BasicCheckbox';

interface BasicSelectProps {
  id: number;
}

const BasicSelect: React.FC<BasicSelectProps> = ({ id }) => {
  const course = useSelector<RootState, string>((state) => state.courseCards[id].course || '');
  const hasHonors = useSelector<RootState, boolean>(
    (state) => state.courseCards[id].hasHonors || false,
  );
  const hasRemote = useSelector<RootState, boolean>(
    (state) => state.courseCards[id].hasRemote || false,
  );
  const hasAsynchronous = useSelector<RootState, boolean>(
    (state) => state.courseCards[id].hasAsynchronous || false,
  );

  // shows placeholder text if no course is selected
  if (!course) {
    return (
      <Typography className={styles.placeholderText} color="textSecondary" variant="body1">
        Select a course to show available options
      </Typography>
    );
  }

  // show placeholder message if there are no special sections to filter
  if (!hasHonors && !hasRemote && !hasAsynchronous) {
    return (
      <>
        <FormLabel>Options</FormLabel>
        <table className={styles.tableContainer}>
          <tbody>
            <BasicCheckbox id={id} value="includeFull" label="Include Full Sections" />
          </tbody>
        </table>
        <Typography className={styles.placeholderText} color="textSecondary">
        There are no honors or remote sections for this class
        </Typography>
      </>
    );
  }

  return (
    <>
      <FormLabel>Options</FormLabel>
      <table className={styles.tableContainer}>
        <tbody>
          <BasicCheckbox id={id} value="includeFull" label="Include Full Sections" />
          {hasHonors
            ? <BasicOptionRow id={id} value="honors" label="Honors" />
            : null}
          {hasRemote
            ? <BasicOptionRow id={id} value="remote" label="Remote" />
            : null}
          {hasAsynchronous
            ? <BasicOptionRow id={id} value="asynchronous" label="No Meeting Times" />
            : null}
        </tbody>
      </table>
    </>
  );
};

export default BasicSelect;
