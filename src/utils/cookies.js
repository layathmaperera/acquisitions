export const cookies = {
  getOptions: () => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  }),

  set: (res, name, value, options = {}) => {
    res.cookie(name, value, {
      ...cookies.getOptions(),
      ...options,
    });
  },

  clear: (res, name, options = {}) => {
    res.clearCookie(name, {
      ...cookies.getOptions(),
      ...options,
    });
  },

  get: (req, name) => {
    return req.cookies?.[name];
  },
};
