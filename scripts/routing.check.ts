// Match the framework server environment before loading its experimental matcher helper.
import 'next/dist/server/node-environment-baseline';
import assert from 'node:assert/strict';
import { unstable_doesMiddlewareMatch } from 'next/experimental/testing/server';
import { config } from '../proxy';
import nextConfig from '../next.config';

// Every anonymous app entry must run the guest-cookie proxy, including the bare basePath.
for (const url of ['/app', '/app/', '/app/login', '/app/api/seller', '/app/setup/company']) {
  assert.equal(unstable_doesMiddlewareMatch({ config, nextConfig, url }), true, `Guest proxy must cover ${url}`);
}
for (const url of ['/', '/app/_next/static/chunk.js', '/app/_next/image', '/app/favicon.ico']) {
  assert.equal(unstable_doesMiddlewareMatch({ config, nextConfig, url }), false, `Guest proxy must not cover ${url}`);
}
console.log('guest routing checks ok');
