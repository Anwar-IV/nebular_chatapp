import { useRouteError } from "react-router-dom";

export function ErrorPage() {
  const error: any = useRouteError();
  console.log(error);
  return (
    <div style={{ display: "grid", placeItems: "center", color: "silver" }}>
      <h1>Ooops!</h1>
      <p>Sorry, an unexpected error has occured</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
}
