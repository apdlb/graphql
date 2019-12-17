import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';

import { EntitiesResolver } from './entities.resolver';

@Module({
  imports: [PrismaModule],
  providers: [EntitiesResolver],
})
export class EntitiesModule {}
