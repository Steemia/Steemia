// ENDPOINTS
export const STEEMIA_API = 'https://steemia-api.herokuapp.com/';
export const STEEMIA_POSTS =  STEEMIA_API + 'posts/';
export const STEEMIA_USERS = STEEMIA_API + 'users/'
export const STEEMIA_TAGS = STEEMIA_API + 'tags/';

export const RAW_SERVER = 'https://steemit-production-imageproxy-upload.s3.amazonaws.com/';

export const IMG_SERVER = 'https://steemitimages.com/';
export const BASE_API = 'https://steepshot.org/api/steemia/v1_1/';
export const BASE_API_V1 = 'https://steepshot.org/api/steemia/v1/';
export const STEEPSHOT_BASE = 'https://steepshot.org/api/v1/';
export const USER_SEARCH = BASE_API + 'user/search?';
export const FEED = BASE_API + 'recent?';
export const POSTS = BASE_API + 'posts/';
export const OWN_POSTS = BASE_API + 'user/';
export const STEEMIT = 'https://steemit.com';
export const STEEM_API = 'https://api.steemjs.com/';
export const NO_IMAGE_COMMENT = 'assets/user.png';
export const NO_IMAGE_POST = 'assets/placeholder2.png';

// MESSAGES
export const NOT_LOGGED_IN = 'This action requires you to be logged in. Please, login and try again. ';
export const REBLOGGED_CORRECTLY = 'This post has been reblogged correctly. 😏';
export const IS_REBLOGGED = "You've already reblogged this post. 😂";

// ERRORS
export const ERRORS = {
  DUPLICATE_REBLOG: {
    error: 'blog_itr == blog_comment_idx.end(): Account has already reblogged this post',
    message: 'You have already reblogged this post'
  },
  POST_INTERVAL: {
    error: '( now - auth.last_root_post ) > STEEMIT_MIN_ROOT_COMMENT_INTERVAL: You may only post once every 5 minutes.',
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