// ENDPOINTS
export const STEEMIA_API = 'https://steemia-api.herokuapp.com/';
export const STEEMIA_SEARCH = STEEMIA_API + 'search/';
export const STEEMIA_POSTS =  STEEMIA_API + 'posts/';
export const STEEMIA_USERS = STEEMIA_API + 'users/'
export const STEEMIA_TAGS = STEEMIA_API + 'tags/';

export const RAW_SERVER = 'https://steemit-production-imageproxy-upload.s3.amazonaws.com/';

export const IMG_SERVER = 'https://steemitimages.com/';

export const STEEMIT = 'https://steemit.com';
export const STEEM_API = 'https://api.steemjs.com/';
export const NO_IMAGE_COMMENT = 'assets/user.png';
export const NO_IMAGE_POST = 'assets/placeholder2.png';

// MESSAGES
export const NOT_LOGGED_IN = 'This action requires you to be logged in. Please, login and try again. ';
export const REBLOGGED_CORRECTLY = 'This post has been reblogged correctly. 😏';
export const IS_REBLOGGED = "You've already reblogged this post. 😂";

// PROMO

export const STEEMIA_PROMO = `
<br>
<hr>
Download Steemia app from Google Play.

<a href="https://play.google.com/store/apps/details?id=com.steemia.steemia">
<img src="https://play.google.com/intl/en_us/badges/images/badge_new.png" alt="steemia_google_play">
</a>`

// ERRORS
export const ERRORS = {
  FLAG_ERROR: {
    error: 'itr->vote_percent != o.weight: You have already voted in a similar way.',
    message: 'You have already flag this post with the same percentage.'
  },
  DUPLICATE_REBLOG: {
    error: 'blog_itr == blog_comment_idx.end(): Account has already reblogged this post',
    message: 'You have already reblogged this post'
  },
  POST_INTERVAL: {
    error: '( now - auth.last_root_post ) > STEEM_MIN_ROOT_COMMENT_INTERVAL: You may only post once every 5 minutes.',
    message: 'You may only post once every 5 minutes.'
  },
  COMMENT_INTERVAL: {
    error: '(now - auth.last_post) > STEEMIT_MIN_REPLY_INTERVAL: You may only comment once every 20 seconds.',
    message: 'You may only comment once every 20 seconds.'
  },
  POST_TOO_BIG: {
    fingerprint: '<= (get_dynamic_global_properties().maximum_block_size - 256)',
    message: 'Your post is too big.',
  },
  EMPTY_TEXT: {
    message: 'A comment cannot be empty.'
  },
  TAGS_ERROR: {
    message: 'You should include at least 1 tag.'
  },
  ALL_FIELDS: {
    message: 'You need to fill all fields.'
  }
};

// JSON Metadata
export const METADATA = {
  community: 'steemia', 
  app: 'steemia/0.0.1',
};

// STEEM
export const MAX_ACCEPTED_PAYOUT = '1000000.000 SBD';
export const PERCENT_STEEM_DOLLARS = 10000;
export const OPERATIONS = {
  COMMENT: 'comment',
  VOTE: 'vote',
  POST: 'post',
  FOLLOW: 'follow',
  COMMENT_OPTIONS: 'comment_options',
  FLAG: 'flag'
}
