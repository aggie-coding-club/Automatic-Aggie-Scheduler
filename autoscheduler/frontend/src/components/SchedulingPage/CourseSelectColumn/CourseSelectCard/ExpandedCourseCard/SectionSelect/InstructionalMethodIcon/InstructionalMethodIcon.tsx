import * as React from 'react';
import { Tooltip, Typography } from '@material-ui/core';
import {
  Flight, Language, Laptop, People, Search, Work,
} from '@material-ui/icons';
import { InstructionalMethod } from '../../../../../../../types/Section';
import * as styles from './InstructionalMethodIcon.css';

interface InstructionalMethodIconProps {
  instructionalMethod: InstructionalMethod;
}

/* eslint-disable react/jsx-key */
const instructionalMethodIcons = new Map<InstructionalMethod, JSX.Element>([
  [InstructionalMethod.F2F, <People color="action" fontSize="inherit" />],
  [InstructionalMethod.INTERNSHIP, <Work color="action" fontSize="inherit" />],
  [InstructionalMethod.NONTRADITIONAL, <Search color="action" fontSize="inherit" />],
  [InstructionalMethod.WEB_BASED, <Language color="action" fontSize="inherit" />],
  [InstructionalMethod.STUDY_ABROAD, <Flight color="action" fontSize="inherit" />],
  [InstructionalMethod.NONE, null],
  [InstructionalMethod.REMOTE, <Laptop color="action" fontSize="inherit" />],
  [InstructionalMethod.F2F_REMOTE_OPTION, (
    <>
      <People color="action" fontSize="small" />
      <Typography color="textSecondary">&nbsp;/&nbsp;</Typography>
      <Laptop color="action" fontSize="inherit" />
    </>
  )],
  [InstructionalMethod.MIXED_F2F_REMOTE, (
    <>
      <People color="action" fontSize="small" />
      <Typography color="textSecondary">&nbsp;+&nbsp;</Typography>
      <Laptop color="action" fontSize="inherit" />
    </>
  )],
]);
/* eslint-enable */

const InstructionalMethodIcon: React.FC<InstructionalMethodIconProps> = ({
  instructionalMethod,
}) => {
  const icon = instructionalMethodIcons.get(instructionalMethod);

  return (
    <Tooltip title={instructionalMethod} placement="top" arrow>
      <span className={styles.instructionalMethodContainer}>
        {icon}
      </span>
    </Tooltip>
  );
};

export default InstructionalMethodIcon;
