import { AppBar, styled, Toolbar, Typography } from '@mui/material';
import { Link as NavLink } from 'react-router-dom';
import UserMenu from './UserMenu';
import AnonymousMenu from './AnonymousMenu';
import { selectUser } from "../../features/users/usersSlice.ts";
import {useAppSelector} from "../../app/hooks.ts";

const Link = styled(NavLink)({
  color: 'inherit',
  textDecoration: 'none',
  '&:hover': {
    color: 'inherit',
  }
});
const StyledAppBar = styled(AppBar)({
  background: 'blue',
  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.2)',
  backdropFilter: 'blur(13px)',
  WebkitBackdropFilter: 'blur(13px)',
  padding: '0 30px',
});

const AppToolbar = () => {
  const user = useAppSelector(selectUser);

  return (
    <StyledAppBar position="sticky">
      <Toolbar>
        <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
          <Link to="/">
            Photo Gallery
          </Link>
        </Typography>
        {user ? <UserMenu user={user}/> : <AnonymousMenu/>}
      </Toolbar>
    </StyledAppBar>
  );
};

export default AppToolbar;

