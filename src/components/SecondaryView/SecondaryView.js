import React, {useEffect} from 'react';
import BtnClose from './BtnClose';
import styles from './secondary-view.module.scss';

const SecondaryView = ({children, className, handleClose}) => {
  return(
    <div className={['view', className, styles.secondaryView].join(' ')}>
      <div className={styles.container}>
        {children}
        <BtnClose handleClose={handleClose} />
      </div>
    </div>
  );
}

export default SecondaryView;