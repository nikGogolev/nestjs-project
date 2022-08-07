import { SetMetadata } from '@nestjs/common';

export const Public = () => SetMetadata('role', 'public');
