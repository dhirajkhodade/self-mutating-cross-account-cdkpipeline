#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CrossAccountCdkpipelineStack } from '../lib/cross-account-cdkpipeline-stack';

const sharedBuildAccount = { account: '111111', region: 'us-east-1' };
const app = new cdk.App();

new CrossAccountCdkpipelineStack(app, 'CrossAccountCdkpipelineStack',{
    env: sharedBuildAccount
});
