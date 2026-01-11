import RateLimit from '@fastify/rate-limit';
import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

interface RateLimitPluginOptions {
  maxRequestsPerIp?: number;
  timeWindow?: number | string;
}

/**
 * Rate limiting plugin that restricts requests per IP address.
 * Each unique IP has its own request counter that resets after the time window.
 * Default: 100 requests per IP per minute.
 *
 * Note: This uses in-memory storage by default, which does not share state across
 * multiple server instances. For multiserver deployments, configure a Redis store.
 * See: https://github.com/fastify/fastify-rate-limit
 */
async function rateLimitPlugin(fastify: FastifyInstance, options: RateLimitPluginOptions) {
  await fastify.register(RateLimit, {
    max: options.maxRequestsPerIp ?? 100,
    timeWindow: options.timeWindow ?? '1 minute',
    keyGenerator: (request) => request.ip,
    errorResponseBuilder: (_, context) => ({
      status: 429,
      type: 'https://datatracker.ietf.org/doc/html/rfc6585#section-4',
      message: `Rate limit exceeded. Try again in ${context.after}`,
    }),
  });
}

export default fp(rateLimitPlugin, { name: 'rate-limit-plugin' });
