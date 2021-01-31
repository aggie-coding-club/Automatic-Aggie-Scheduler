import * as React from 'react';
import * as styles from '../SchedulePreview.css';

interface ColorBoxProps {
  color?: string;
}

const ColorBox: React.FC<ColorBoxProps> = ({ color }) => (
  color ? (
    <span className={styles.colorBox} style={{ backgroundColor: color }} />
  ) : (
    <span className={styles.colorBoxPlaceholder} style={{ backgroundColor: '#fff' }}>
      <span className={styles.xIconOuter}>
        <span className={styles.xIconInner} />
      </span>
    </span>
  )
);

export default ColorBox;
