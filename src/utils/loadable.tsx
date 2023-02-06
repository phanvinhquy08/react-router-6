import React, { ComponentType } from 'react';

export default function loadable(
  name: string,
  fallback: React.ReactNode = <p>Loading component...</p>,
) {
  let LazyActual: React.FC = React.lazy(
    () =>
      import(`src/pages/${name}/index`) as Promise<{
        default: ComponentType<any>;
      }>,
  );

  const Page: React.FC = () => {
    return (
      <React.Suspense fallback={fallback}>
        <LazyActual />
      </React.Suspense>
    );
  };

  async function loader(...args) {
    const controller = new AbortController();

    import(`src/pages/${name}/index`).then(
      (componentModule: { default: React.FC }) => {
        if (!controller.signal.aborted) {
          LazyActual = componentModule.default;
        }
      },
      () => {},
    );

    try {
      const { default: loader }: { default: (...args: any[]) => Promise<any> } =
        await import(`src/pages/${name}/loader`);

      if (!loader) return;

      return await loader(...args);
    } finally {
      controller.abort();
    }
  }

  return {
    element: <Page />,
    loader,
  };
}
