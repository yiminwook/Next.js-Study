export default function Error({ statusCode }: any) {
  console.log(statusCode)
  return (
    <p>
      {statusCode 
      ? `An error ${statusCode} ocurred on Server`
      :  "An error occurred on client"}
    </p>
  );
}

Error.getInitialProps = ({ res, err }: any) => {
  const statusCode = res ? res.statusCode : (err ? err.statusCode : 404);
  return { statusCode };
}