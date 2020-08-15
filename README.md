# Welcome to Self Mutating CROSS Account AWS CDK Pipeline project!

This is a CDK application which creates CI/CD pipeline to deploy CDK applications to same or another AWS account.

## Project Summary

We are creating self mutating CI/CD pipeline here.
This is a CDK app that deploys itself inside AWS account and then self updates and manages itself (self mutates) uisng this amazing `CdkPipeline` construct from CDK library.

This means you only need to run `cdk deploy` once to get the pipeline started. After that if you make any changes into this pipeline code it autoamtically updates itself.

In this project I am creating this cdk pipeline in account 1.
Then I have added a stage at the end of pipeline in `cross-account-cdkpipeline-stack.ts` file to create Elastic Beanstalk Environment in account 2 which is my non prod account.

```typescript
const nonProdAccount = { account: "222222", region: "us-east-1" };
   
    // This is where we add the application stages
    pipeline.addApplicationStage(new CreateIisEbEnvironmentStage(this, 'IISEBInfraDev', {
        env: { account: nonProdAccount.account, region: nonProdAccount.region }
    }));
```
Similarly, if you get a requirement to create this same EB environment into prod account 3, then you will just add one more stage and push your code to your repository and as I said this is self mutating pipeline, so it will automatically update itself and add new stage to your pipeline and will create new elastic beanstalk environment in aws account 3, isn't this amazing!

```typescript
const prodAccount = { account: "333333", region: "us-east-1" };
   
    // This is where we add the application stages
    pipeline.addApplicationStage(new CreateIisEbEnvironmentStage(this, 'IISEBInfraDev', {
        env: { account: prodAccount.account, region: prodAccount.region }
    }));
```

Reference - https://aws.amazon.com/blogs/developer/cdk-pipelines-continuous-delivery-for-aws-cdk-applications/

## Useful commands

 * `npm run build`   compile typescript to js
 * `cdk synth`       emits the synthesized CloudFormation template
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state


* To deploy initial pipeline 
```bash 
npx cdk deploy \
  --profile account1-profile \
  CdkpipelinesDemoPipelineStack
```
* You have to bootstrap the accounts and Regions you want to deploy to, and they must have a trust relationship added to the pipeline account.
```bash
npx cdk bootstrap \
  --profile account2-profile \
  --trust ACCOUNT1 \
  --cloudformation-execution-policies arn:aws:iam::aws:policy/AdministratorAccess \
  aws://ACCOUNT2/us-west-2
```



