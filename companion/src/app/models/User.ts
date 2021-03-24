export interface User {
  /**
   * Get username of user.
   */
  getUsername(): string;

  /**
   * Get name of user.
   */
  getName(): string;

  /**
   * Get link state of user.
   * True if user is linked to alexa user.
   */
  isLinked(): boolean;
}
