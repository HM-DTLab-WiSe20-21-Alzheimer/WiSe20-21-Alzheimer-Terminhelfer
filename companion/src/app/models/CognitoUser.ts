import { User } from './User';

type CognitoUserAttributes = { name: string; 'custom:linkid': string };

export class CognitoUser implements User {
  private readonly username: string;
  private readonly name: string;
  private readonly linkId: string;

  static fromResult(
    user: Record<string, unknown> | null,
  ): CognitoUser | null {
    return user ? new CognitoUser(user) : null;
  }

  private constructor(user: Record<string, unknown>) {
    this.username = user.username as string;
    const attributes = user.attributes as CognitoUserAttributes;
    this.name = attributes.name;
    this.linkId = attributes['custom:linkid'];
  }

  getUsername(): string {
    return this.username;
  }

  isLinked(): boolean {
    return !!this.linkId;
  }

  getName(): string {
    return this.name;
  }

}
