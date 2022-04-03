FROM public.ecr.aws/bitnami/node:16-prod

COPY dist .
COPY node_modules node_modules

ARG PORT

ENV PORT=$PORT
ENV NODE_ENV=production

EXPOSE $PORT

CMD ["node", "./web/api/server.js"]
