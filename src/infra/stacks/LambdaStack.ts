import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import {
  Code,
  Function as LambdaFunction,
  Runtime,
} from "aws-cdk-lib/aws-lambda";
// the below import is a node.js way to construct a path
import { join } from "path";
import { LambdaIntegration } from "aws-cdk-lib/aws-apigateway";
import { ITable } from "aws-cdk-lib/aws-dynamodb";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";

interface LambdaStackProps extends StackProps {
  spacesTable: ITable;
}

export class LambdaStack extends Stack {
  public readonly helloLambdaIntegration: LambdaIntegration;

  constructor(scope: Construct, id: string, props: LambdaStackProps) {
    super(scope, id, props);

    const helloLambda = new NodejsFunction(this, "HelloLambda", {
      runtime: Runtime.NODEJS_18_X,
      // name of the function that is exported from hello.ts
      handler: "handler",
      // the path to the handler function export file
      entry: join(__dirname, "..", "..", "services", "hello.ts"),
      environment: {
        TABLE_NAME: props.spacesTable.tableName,
      },
    });

    // allows this lambda to use the SDK to list buckets as shown in the handler, hello.ts
    helloLambda.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ["s3:ListAllMyBuckets", "s3:ListBucket"],
        resources: ["*"],
      })
    );

    // the below is an example of a LambdaFunction instead of a NodejsFunction
    //* const helloLambda = new LambdaFunction(this, "HelloLambda", {
    //*  runtime: Runtime.NODEJS_18_X,
    // from the hello.js file found in services
    //*  handler: "hello.main",
    // the below join constructs a path for us. "__dirname" starts us at our current location
    //*  code: Code.fromAsset(join(__dirname, "..", "..", "services")),
    //*  environment: {
    // connects this lambda to the desired dynamoDB table
    //*    TABLE_NAME: props.spacesTable.tableName,
    //*  },
    //*});

    this.helloLambdaIntegration = new LambdaIntegration(helloLambda);
  }
}
