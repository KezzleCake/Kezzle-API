FROM public.ecr.aws/lambda/nodejs:18

COPY . .

RUN npm run build

CMD ["dist/lambda.handler"]