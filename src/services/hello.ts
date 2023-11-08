import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { v4 } from "uuid";
import { S3Client, ListBucketsCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({});

async function handler(event: APIGatewayProxyEvent, context: Context) {
  const command = new ListBucketsCommand({});
  const listBucketsResult = (await s3Client.send(command)).Buckets;

  const response: APIGatewayProxyResult = {
    statusCode: 200,
    body: JSON.stringify(
      "Hello from lambda, here are your buckets:" +
        JSON.stringify(listBucketsResult)
    ),
  };
  // this log will show up in cloudwatch logs
  console.log(event);

  return response;
}

export { handler };

//* exports.main = async function (event, context) {
//*   return {
//*     statusCode: 200,
// this function has access to TABLE_NAME because the LambdaStack.ts LambdaFunction enviroment configuration was
// set with the TABLE_NAME property.  Check LambdaStack.ts to see.
//*     body: JSON.stringify(`Hello!  I will read from ${process.env.TABLE_NAME}`),
//*   };
//* };
