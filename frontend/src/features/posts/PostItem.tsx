import {PostsDetails} from "../../types";
import React from "react";
import {Button, Card, CardActionArea, CardMedia, Grid, styled, Typography} from "@mui/material";
import {Link} from "react-router-dom";
import {useAppSelector} from "../../app/hooks.ts";
import {selectUser} from "../users/usersSlice.ts";
import {apiURL} from "../../constants.ts";
import imageNotAvailable from '../../assets/images/image_not_available.png';

const ImageCardMedia = styled(CardMedia)({
  height: 0,
  paddingTop: '56.25%',
});

interface Props {
  post: PostsDetails;
}

const PostItem: React.FC<Props> = ({post}) => {
  const user = useAppSelector(selectUser);
  let cardImage = imageNotAvailable;

  if (post.image) {
    cardImage = apiURL + '/' + post.image;
  }

  return (
    <Card sx={{
      border: '1px solid black',
      margin: '20px', padding: '10px',
      width: 345,
      display: 'flex',
      flexDirection: 'column',
    }}>
      <CardActionArea component={Link} to={'/cocktails/' + post._id}>
        <Grid sx={{display: 'flex', alignItems: 'center'}}>
          <Typography sx={{fontWeight: 'bold'}} variant="h5">{post.name}</Typography>
        </Grid>
        <ImageCardMedia image={cardImage} title={post.name}/>
        {!post.published && user && user._id === post.user._id ?
          <Typography sx={{fontSize: '11px', color: 'red', marginLeft: 'auto'}}>
            Ваш коктейль находится на рассмотрении модератора
          </Typography>
          : null
        }
      </CardActionArea>
      <Link to={`/posts?user=${post.user._id}`}
            style={{color: 'black', marginTop: '30px', width: '60px'}}
      >
        <Typography sx={{fontWeight: 'bold', color: 'black'}}>{post.user.displayName}</Typography>
      </Link>
      <Grid sx={{display: 'flex', alignItems: 'center', marginTop: '20px'}}>
        {user?.role === 'admin' ?
          <Button
            variant="contained"
            color="error"
          >Delete
          </Button> : null}
        {user?.role === 'admin' && !post.published ? <Button
          variant="contained"
          sx={{marginLeft: '10px'}}
          color="success"
        >
          Published
        </Button> : null}
      </Grid>
    </Card>
  );
};

export default PostItem;