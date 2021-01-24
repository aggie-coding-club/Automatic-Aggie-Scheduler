import { CSSProperties } from '@material-ui/styles';
import * as React from 'react';
import * as styles from '../SchedulePreview.css';

interface ColorBoxProps {
  color?: string;
}

const ColorBox: React.FC<ColorBoxProps> = ({ color }) => {
  const colorBoxStyle: CSSProperties = color ? { backgroundColor: color } : { visibility: 'hidden' };

  return <span className={styles.colorBox} style={colorBoxStyle} />;
};

export default ColorBox;
