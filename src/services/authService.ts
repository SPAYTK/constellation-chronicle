import * as R from 'ramda';
import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import * as O from 'fp-ts/Option';
import { supabase } from '@/integrations/supabase/client';

// Immutable types
export interface User {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly role: 'user' | 'editor' | 'admin';
  readonly createdAt: Date;
}

export interface AuthState {
  readonly user: O.Option<User>;
  readonly isAuthenticated: boolean;
  readonly isLoading: boolean;
}

export interface Credentials {
  readonly email: string;
  readonly password: string;
}

export interface SignUpData extends Credentials {
  readonly name: string;
}

// Pure function to create user from Supabase auth + profile data
const createUserFromSupabase = (
  id: string,
  email: string,
  name: string,
  role: 'user' | 'editor' | 'admin' = 'user'
): User => ({
  id,
  email,
  name,
  role,
  createdAt: new Date()
});

// Fetch user profile from database
const fetchUserProfile = async (userId: string): Promise<O.Option<User>> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, name, role')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return O.none;
    }

    return O.some(
      createUserFromSupabase(
        data.id,
        data.email,
        data.name,
        data.role as 'user' | 'editor' | 'admin'
      )
    );
  } catch (error) {
    console.error('Error in fetchUserProfile:', error);
    return O.none;
  }
};

// Pure functions for localStorage operations (cache)
const storeUser = (user: User): void =>
  localStorage.setItem('auth_user', JSON.stringify(user));

const clearStoredUser = (): void =>
  localStorage.removeItem('auth_user');

const getStoredUser = (): O.Option<User> =>
  R.pipe(
    () => localStorage.getItem('auth_user'),
    O.fromNullable,
    O.chain(stored =>
      E.tryCatch(
        () => JSON.parse(stored),
        () => undefined
      ) as any
    ),
    O.filter((user: any) => user && typeof user === 'object' && user.id)
  )();


// Functional authentication operations using Supabase
export const signIn = (credentials: Credentials): TE.TaskEither<Error, User> =>
  TE.tryCatch(
    async () => {
      // Sign in with Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      });

      if (error) throw new Error(error.message);
      if (!data.user) throw new Error('No user returned from sign in');

      // Fetch user profile
      const profileOption = await fetchUserProfile(data.user.id);
      
      const user = O.fold(
        () => createUserFromSupabase(
          data.user.id,
          data.user.email || credentials.email,
          data.user.user_metadata?.name || 'User',
          'user'
        ),
        (profile: User) => profile
      )(profileOption);

      storeUser(user);
      return user;
    },
    (error) => error as Error
  );

export const signUp = (data: SignUpData): TE.TaskEither<Error, User> =>
  TE.tryCatch(
    async () => {
      // Create user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name
          }
        }
      });

      if (authError) throw new Error(authError.message);
      if (!authData.user) throw new Error('No user returned from sign up');

      // Create profile in database
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          email: data.email,
          name: data.name,
          role: 'user'
        });

      if (profileError) {
        console.error('Error creating profile:', profileError);
        // Don't throw - auth succeeded even if profile creation fails
      }

      const user = createUserFromSupabase(
        authData.user.id,
        data.email,
        data.name,
        'user'
      );

      storeUser(user);
      return user;
    },
    (error) => error as Error
  );

export const signOut = (): TE.TaskEither<Error, void> =>
  TE.tryCatch(
    async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw new Error(error.message);
      clearStoredUser();
    },
    (error) => error as Error
  );

// Pure function to get current user
export const getCurrentUser = (): O.Option<User> => getStoredUser();

// Pure function to check authentication
export const isAuthenticated = (): boolean =>
  O.isSome(getCurrentUser());

// Pure function to check role
export const hasRole = (role: string): boolean =>
  R.pipe(
    getCurrentUser,
    O.map(user => user.role === role),
    O.getOrElse(() => false)
  )(undefined);

// Curried version for composition
export const hasSpecificRole = R.curry((role: string) => hasRole(role));

// Pure function to check if user is editor
export const isEditor = (): boolean =>
  hasRole('editor') || hasRole('admin');

// Pure function to initialize auth state
export const initializeAuthState = (): AuthState => ({
  user: getCurrentUser(),
  isAuthenticated: isAuthenticated(),
  isLoading: false
});

// Functional auth state change listener (simplified)
export const createAuthStateListener = (
  callback: (state: AuthState) => void
): (() => void) => {
  const handler = () => callback(initializeAuthState());

  window.addEventListener('storage', handler);

  return () => {
    window.removeEventListener('storage', handler);
  };
};

// Functional composition for auth checks
export const requireAuth = <T>(fn: (user: User) => T): (user: O.Option<User>) => O.Option<T> =>
  R.pipe(
    O.map(fn)
  );

export const requireEditor = <T>(fn: (user: User) => T): (user: O.Option<User>) => O.Option<T> =>
  R.pipe(
    O.filter(user => user.role === 'editor' || user.role === 'admin'),
    O.map(fn)
  );

// Utility functions for functional composition
export const withAuth = <T>(fn: (user: User) => T): TE.TaskEither<Error, T> =>
  R.pipe(
    getCurrentUser,
    O.fold(
      () => TE.left(new Error('Not authenticated')),
      (user) => TE.right(fn(user))
    )
  );

export const withEditorAuth = <T>(fn: (user: User) => T): TE.TaskEither<Error, T> =>
  R.pipe(
    getCurrentUser,
    O.fold(
      () => TE.left(new Error('Not authenticated')),
      (user) => user.role === 'editor' || user.role === 'admin'
        ? TE.right(fn(user))
        : TE.left(new Error('Editor access required'))
    )
  );