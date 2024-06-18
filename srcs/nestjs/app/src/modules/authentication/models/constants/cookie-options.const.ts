export const secureCookieOptions: any = {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    priority: 'high',
};

export const jwtTokenCookieOptions: any = (exp: Date) => ({
    ...secureCookieOptions,
    expires: exp,
})