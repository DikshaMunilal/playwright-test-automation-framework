export const PASSWORD = 'secret_sauce';

export const users = Object.freeze({
  standard:          { username: 'standard_user',           valid: true },
  lockedOut:         { username: 'locked_out_user',         valid: false, error: /locked out/i },
  problem:           { username: 'problem_user',            valid: true },
  performanceGlitch: { username: 'performance_glitch_user', valid: true },
});