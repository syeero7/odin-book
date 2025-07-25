import {
  useRouteError,
  Link,
  isRouteErrorResponse,
  type ErrorResponse,
} from "react-router-dom";
import styles from "./ErrorBoundary.module.css";

function ErrorBoundary() {
  const error = useRouteError();

  return (
    <article className={styles.container}>
      {isRouteErrorResponse(error) ? (
        <ErrorResponse error={error} />
      ) : error instanceof Error ? (
        <StackTrace error={error} />
      ) : (
        <h1>Unknown Error</h1>
      )}
    </article>
  );

  function ErrorResponse({ error }: ErrorProps<ErrorResponse>) {
    const unauthorized = error.status === 401;

    return (
      <div>
        <h1>Oops! Something went wrong.</h1>

        <article className={styles.errorContent}>
          <p>
            {error.status} {error.statusText}
          </p>
          <p>
            {unauthorized && "Go to "}
            <Link viewTransition to={unauthorized ? "/login" : "/"}>
              {unauthorized ? "Login" : "Homepage"}
            </Link>
          </p>
        </article>
      </div>
    );
  }
}

function StackTrace({ error }: ErrorProps<Error>) {
  return (
    <div>
      <h1>Error</h1>
      <p>{error.message}</p>
      <p>The stack trace is:</p>
      <pre>{error.stack}</pre>
    </div>
  );
}

type ErrorProps<T> = { error: T };

export default ErrorBoundary;
