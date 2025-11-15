import React, { Suspense } from "react";
import LoadingSpinner from "./LoadingSpinner";

const SuspenseWrapper = ({ children, loadingMessage }) => (
  <Suspense fallback={<LoadingSpinner message={loadingMessage} />}>
    {children}
  </Suspense>
);

export default SuspenseWrapper;