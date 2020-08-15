import { CfnOutput, Construct, Stage, StageProps } from '@aws-cdk/core';
import { CreateIisEbEnvironmentStack } from './create-IIS-EB-environment-stack';

/**
 * Deployable unit of Elastic Beanstalk IIS Environment
 */
export class CreateIisEbEnvironmentStage extends Stage {
  public readonly urlOutput: CfnOutput;
  
  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);

    const app = new CreateIisEbEnvironmentStack(this, 'IISEbInfraStack');
    
  }
}