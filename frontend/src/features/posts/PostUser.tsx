import {useAppDispatch, useAppSelector} from "../../app/hooks.ts";
import {selectUser} from "../users/usersSlice.ts";
import {selectLoading, selectPosts} from "./postsSlice.ts";
import {fetchPosts} from "./postsThunk.ts";
import {useEffect} from "react";
import {CircularProgress, Grid, Typography} from "@mui/material";
import PostItem from "./PostItem.tsx";

const PostsUser = () => {
  const dispatch = useAppDispatch();
  const postsUser = useAppSelector(selectPosts);
  const user = useAppSelector(selectUser);
  const params = new URLSearchParams(location.search);
  const userId = params.get('user');
  const loading = useAppSelector(selectLoading);

  useEffect(() => {
    if (user && userId) {
      dispatch(fetchPosts(user._id));
    }
  }, [dispatch, user, userId]);

  return loading ? (
    <CircularProgress />
  ) : (
    <Grid sx={{display: 'flex', flexDirection: 'column'}}>
      <Typography sx={{margin: '0 auto', color: 'white'}} variant="h3">{user?.displayName} Gallery</Typography>
      <Grid sx={{display: 'flex', marginTop: '30px'}}>
        {postsUser.map((item) => (
          (user?.role === 'admin' || user?._id === item.user?._id || item.published) && (
            <PostItem post={item} key={item._id}/>
          )
        ))}
      </Grid>
    </Grid>
  );
};

export default PostsUser;