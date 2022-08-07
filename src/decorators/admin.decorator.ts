import { SetMetadata } from '@nestjs/common';

export const Admin = () => {
  return SetMetadata('role', 'admin');
};
