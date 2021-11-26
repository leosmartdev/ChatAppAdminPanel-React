import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import searchFill from '@iconify/icons-eva/search-fill';
import trash2Fill from '@iconify/icons-eva/trash-2-fill';
import roundFilterList from '@iconify/icons-ic/round-filter-list';
// material
import { useTheme, styled } from '@material-ui/core/styles';
import { Box, Toolbar, Tooltip, IconButton, Typography, OutlinedInput, InputAdornment } from '@material-ui/core';

// ----------------------------------------------------------------------

const RootStyle = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3)
}));

const SearchStyle = styled(OutlinedInput)(({ theme }) => ({
  width: 240,
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter
  }),
  '&.Mui-focused': { width: 320, boxShadow: theme.customShadows.z8 },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${theme.palette.grey[500_32]} !important`
  }
}));

// ----------------------------------------------------------------------

MailListToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterLocation: PropTypes.string,
  onFilterLocation: PropTypes.func,
  filterCoverage: PropTypes.string,
  onFilterCoverage: PropTypes.func,
  filterBalance: PropTypes.string,
  onFilterBalance: PropTypes.func,
  filterCredit: PropTypes.string,
  onFilterCredit: PropTypes.func
};

export default function MailListToolbar({
  numSelected,
  filterLocation,
  onFilterLocation,
  filterCoverage,
  onFilterCoverage,
  filterBalance,
  onFilterBalance,
  filterCredit,
  onFilterCredit
}) {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';

  return (
    <RootStyle>
      <SearchStyle value={filterLocation} onChange={onFilterLocation} placeholder="Location" />
      <SearchStyle value={filterCoverage} onChange={onFilterCoverage} placeholder="Coverage" />
      <SearchStyle value={filterBalance} onChange={onFilterBalance} placeholder="Balance" />
      <SearchStyle value={filterCredit} onChange={onFilterCredit} placeholder="Credit" />
    </RootStyle>
  );
}
