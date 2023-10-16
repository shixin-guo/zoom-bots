import React from 'react';
import { builder } from '@builder.io/sdk';

import builderConfig from '@/config/builder';

import { RenderBuilderContent } from './builder';

builder.init(builderConfig.apiKey);
interface PageProps {
  params: {
    page: string[];
  };
}

export default async function Page(props: PageProps) {
  const content = await builder
    .get('page', {
      userAttributes: {
        urlPath: '/builder/' + (props.params?.page?.join('/') || ''),
      },
      // Set prerender to false to return JSON instead of HTML
      prerender: false,
    })
    .toPromise();

  return (
    <>
      <RenderBuilderContent content={content} />
    </>
  );
}
