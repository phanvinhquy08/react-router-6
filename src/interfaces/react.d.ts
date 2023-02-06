import { FunctionComponent, PropsWithChildren } from 'react';

declare module 'React' {
  declare namespace React {
    export type FC<P = {}> = FunctionComponent<PropsWithChildren<P>>;
  }

  export = React;
  export as namespace React;
}
