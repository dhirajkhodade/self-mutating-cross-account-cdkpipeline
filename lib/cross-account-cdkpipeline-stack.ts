import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codepipeline_actions from '@aws-cdk/aws-codepipeline-actions';
import { Construct, SecretValue, Stack, StackProps } from '@aws-cdk/core';
import { CdkPipeline, SimpleSynthAction } from "@aws-cdk/pipelines";
import codecommit = require("@aws-cdk/aws-codecommit");
import { CreateIisEbEnvironmentStage } from './create-IIS-EB-environment-stage';


export class CrossAccountCdkpipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const cdkSourceOutput = new codepipeline.Artifact();
    const cloudAssemblyArtifact = new codepipeline.Artifact();

    //codecommit git repository of this cdk app that you are currently looking at
    const cdkSourceCodeRepo = codecommit.Repository.fromRepositoryName(
        this,
        "CdkAppSourceRepo",
        "cross-account-cdkpipeline"
    );

    const pipeline = new CdkPipeline(this, 'Pipeline', {
        // The main pipeline name
        pipelineName: 'MySelfMutatingCdkPipeline',
        cloudAssemblyArtifact,

        // Where the cdk source can be found
        sourceAction: new codepipeline_actions.CodeCommitSourceAction({
            actionName: "CodeCommit_CdkSource",
            repository: cdkSourceCodeRepo,
            output: cdkSourceOutput,
            // branch: "develop"
        }),

        // How it will cdk be built and synthesized
        synthAction: SimpleSynthAction.standardNpmSynth({
            sourceArtifact: cdkSourceOutput,
            cloudAssemblyArtifact,
            // We need a build step to compile the TypeScript 
            buildCommand: 'npm run build'
        }),
    });

    const nonProdAccount = { account: "222222", region: "us-east-1" };
   
    // This is where we add the application stages
    pipeline.addApplicationStage(new CreateIisEbEnvironmentStage(this, 'IIS_EBInfra_Dev', {
        env: { account: nonProdAccount.account, region: nonProdAccount.region }
    }));

  }
}
