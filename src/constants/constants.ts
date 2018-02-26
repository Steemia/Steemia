export const IMG_SERVER = 'https://steemitimages.com/';
export const BASE_API = 'https://steepshot.org/api/steemia/v1_1/';
export const BASE_API_V1 = 'https://steepshot.org/api/steemia/v1/';
export const STEEPSHOT_BASE = 'https://steepshot.org/api/v1/';
export const STEEPSHOT_BASE_V1_1 = 'https://steepshot.org/api/v1_1/';
export const FEED = BASE_API + 'recent?';
export const POSTS = BASE_API + 'posts/';
export const OWN_POSTS = BASE_API + 'user/';
export const STEEMIT = 'https://steemit.com';
export const STEEM_API = 'https://api.steemjs.com';
export const NO_IMAGE_COMMENT = 'assets/user.png';
export const NO_IMAGE_POST = 'assets/placeholder2.png';

export const METADATA = {
      community: 'steemia', 
      app: `steemia/0.0.1`, 
      format: 'markdown'
};

export default {
      POST_INTERVAL: {
        fingerprint: 'You may only post once every 5 minutes',
        message: 'You may only post once every 5 minutes.',
      },
      COMMENT_INTERVAL: {
        fingerprint: 'You may only comment once every 20 seconds.',
        message: 'You may only comment once every 20 seconds.',
      },
      DUPLICATE_VOTE: {
        fingerprint: 'You have already voted in a similar way',
        message: 'You have already voted in a similar way.',
      },
      DUPLICATE_REBLOG: {
        fingerprint: 'Account has already reblogged this post',
        message: 'You have already reblogged this post',
      },
      POST_TOO_BIG: {
        fingerprint: '<= (get_dynamic_global_properties().maximum_block_size - 256)',
        message: 'Your post is too big.',
      },
      BANDWIDTH_EXCEEDED: {
        fingerprint: 'bandwidth limit exceeded',
        message: 'Your bandwith has been exceeded. Please wait to transact or power up STEEM.',
      },
};