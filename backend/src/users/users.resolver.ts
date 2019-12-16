import { Args, Info, Query, Resolver } from '@nestjs/graphql';

import { User } from '../graphql';
import { PrismaService } from '../prisma/prisma.service';

@Resolver()
export class UsersResolver {
  constructor(private readonly prisma: PrismaService) {}

  @Query('users')
  async getUsers(@Args() args, @Info() info): Promise<User[]> {
    return await this.prisma.query.users(args, info);
  }
}
