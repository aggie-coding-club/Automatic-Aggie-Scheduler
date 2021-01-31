import * as React from 'react';
import * as styles from '../SchedulePreview.css';

interface ColorBoxProps {
  color?: string;
}

const ColorBox: React.FC<ColorBoxProps> = ({ color }) => {
  return color ? (
    <span className={styles.colorBox} style={{ backgroundColor: color }} />
  ) : (
    <span className={styles.colorBoxPlaceholder} style={{ backgroundColor: '#fff' }}>
      <span className={styles.xIconOuter}>
        <span className={styles.xIconInner} />
      </span>
    </span>
  );
  // const colorBoxStyle: CSSProperties = color ? { backgroundColor: color } : { visibility: 'hidden' };

};

export default ColorBox;
