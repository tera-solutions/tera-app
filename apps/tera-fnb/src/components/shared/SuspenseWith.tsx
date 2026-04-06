import React, { Suspense, lazy } from 'react';
import { ScreenLoader } from '../ui/ScreenLoader';
import MyErrorBoundary from "./MyErrorBoundary";

// Tách ra ngoài để không bị khởi tạo lại khi render
const SuspenseWith = (importFunc: () => Promise<any>) => {
  const LazyComponent = lazy(importFunc);

  return (props: any) => {
    return (
      <MyErrorBoundary>
        <Suspense fallback={<ScreenLoader />}>
          <LazyComponent {...props} />
        </Suspense>
      </MyErrorBoundary>
    );
  };
};

export default SuspenseWith;