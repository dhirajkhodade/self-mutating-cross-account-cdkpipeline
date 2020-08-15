import * as cdk from '@aws-cdk/core';
import elasticbeanstalk = require("@aws-cdk/aws-elasticbeanstalk");

export class CreateIisEbEnvironmentStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const ebApp = new elasticbeanstalk.CfnApplication(this, "EBApplication", {
      applicationName: "IIS_EBInfra"
    });

    const ebEnv = new elasticbeanstalk.CfnEnvironment(this, "Environment", {
      environmentName: "IIS_EBInfra_Env",
      applicationName: "IIS_EBInfra",
      solutionStackName: "64bit Windows Server 2019 v2.5.8 running IIS 10.0",
      //Example of some options which can be configured
      optionSettings: [
        {
          namespace: 'aws:autoscaling:launchconfiguration',
          optionName: 'IamInstanceProfile',
          value: 'AWS-EC2Instance'
        },
        {
          namespace: 'aws:elb:listener',
          optionName: 'ListenerProtocol',
          value: 'TCP'
        }
      ]
    });

    //This is imp to make sure eb app is ready before environment 
    ebEnv.addDependsOn(ebApp);

  }
}
