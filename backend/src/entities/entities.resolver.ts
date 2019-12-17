import { Args, Info, Query, Resolver } from '@nestjs/graphql';
import { Entity } from 'generated/prisma-client';
import { GraphQLResolveInfo } from 'graphql';

import { PrismaService } from '../prisma/prisma.service';

@Resolver('Entities')
export class EntitiesResolver {
  constructor(private readonly prisma: PrismaService) {}

  @Query('entitiesConnection')
  async getEntities(
    @Args() args: any,
    @Info() info: GraphQLResolveInfo | string,
  ): Promise<Entity[]> {
    return await this.prisma.query.entitiesConnection(args, info);
  }
}
