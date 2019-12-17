import { Injectable } from '@nestjs/common';

import { Prisma } from './prisma.binding';

@Injectable()
export class PrismaService extends Prisma {
  constructor() {
    super({
      endpoint: `${process.env.PRISMA_PROTOCOL}://${process.env.PRISMA_HOST}${
        process.env.PRISMA_PORT ? `:${process.env.PRISMA_PORT}` : ''
      }`,
      secret: process.env.PRISMA_MANAGEMENT_API_SECRET,
      debug: false,
    });
  }
}
