/* eslint-disable no-param-reassign */
import type { BEM } from './bem';
import { createBEM } from './bem';

type CreateNamespaceReturn = [BEM, string];

export function createNamespace(name: string): CreateNamespaceReturn {
  name = `ac-${name}`;
  return [createBEM(name), name];
}
