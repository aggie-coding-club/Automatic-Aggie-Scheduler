import * as React from 'react';
import {
  Menu, MenuItem, Button,
} from '@material-ui/core';
import { navigate } from '@reach/router';
import * as Cookies from 'js-cookie';
import { useDispatch } from 'react-redux';
import setTerm from '../../../redux/actions/term';
import * as styles from './SelectTerm.css';

/**
 * Stateful function that caches the json for an api/terms call, so that the API route
 * only has to be fetched once.
 */
const getTermsJson = ((): () => Promise<any> => {
  let fetchedData: Promise<any>;

  return async (): Promise<any> => {
    if (fetchedData) return fetchedData;

    fetchedData = fetch('api/terms').then((res) => res.json());
    return fetchedData;
  };
})();

const SelectTerm: React.FC = () => {
  // anchorEl tells the popover menu where to center itself. Null means the menu is hidden
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [options, setOptions] = React.useState<string[]>([]);
  const [termMap, setTermMap] = React.useState<Map<string, string>>(new Map());
  const open = Boolean(anchorEl);

  // Fetch all terms to use as ListItem options
  function getTerms(): void {
    getTermsJson().then(
      (res) => {
        const termsMap = new Map<string, string>(Object.entries(res));
        setTermMap(termsMap);
        setOptions(Array.from(termsMap.keys()));
      },
    );
  }

  React.useEffect(getTerms, []);

  const [selectedTerm, setSelectedTerm] = React.useState(options[0]);

  const dispatch = useDispatch();

  const handleClick = (event: React.MouseEvent<HTMLElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (option: string): void => {
    setAnchorEl(null);
    // Do nothing if user didn't select a term
    if (typeof option !== 'string') return;

    setSelectedTerm(option);

    // Get the corresponding option given the term's description
    const term: string = termMap.get(option);

    // Redirect to the main page, term will be set and retrieved by API calls
    // Ignore any errors (caused by cookies not being enabled) so that sessions aren't needed
    // in order to set term
    fetch(`sessions/set_last_term?term=${term}`, {
      method: 'PUT',
      headers: {
        'X-CSRFToken': Cookies.get('csrftoken'),
      },
    }).catch(() => {
    }).finally(() => {
      // Set term, if cookies are enabled this will be overwritten when the scheduling page loads
      dispatch(setTerm(term));
      navigate('/schedule');
    });
  };

  return (
    <div className={styles.buttonContainer}>
      <Button
        className={styles.selectTermButton}
        variant="contained"
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
            Select Term
      </Button>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        keepMounted
        open={open}
        onClose={handleClose}
        PaperProps={{
          className: styles.menuPaper,
        }}
      >
        {
            /* renders a menu item for each term */
            options.map((option) => (
              <MenuItem
                key={option}
                selected={option === selectedTerm}
                onClick={(): void => handleClose(option)}
              >
                {option}
              </MenuItem>
            ))
          }
      </Menu>
    </div>
  );
};

export default SelectTerm;
