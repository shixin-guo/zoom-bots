'use client';
import { BuilderComponent, builder, useIsPreviewing } from '@builder.io/react';
import type { BuilderContent } from '@builder.io/sdk';
import DefaultErrorPage from 'next/error';

import builderConfig from '@/config/builder';
interface BuilderPageProps {
  content?: BuilderContent;
}
builder.init(builderConfig.apiKey);
// https://github.com/BuilderIO/nextjs-builder-starter/blob/main/src/components/builder.tsx
export function RenderBuilderContent({ content }: BuilderPageProps) {
  const isPreviewing = useIsPreviewing();

  if (content || isPreviewing) {
    return <BuilderComponent content={content} model="page" />;
  }

  return <DefaultErrorPage statusCode={404} />;
}
