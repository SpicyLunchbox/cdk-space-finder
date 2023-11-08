import { Stack, StackProps } from "aws-cdk-lib";
import { LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";

interface ApiStackProps extends StackProps {
  helloLambdaIntegration: LambdaIntegration;
}

export class ApiStack extends Stack {
  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    // initializes API
    const api = new RestApi(this, "SpacesApi");

    // creates resource
    const spacesResource = api.root.addResource("spaces");

    // adds get method for accessing the resource
    spacesResource.addMethod("GET", props.helloLambdaIntegration);
  }
}
