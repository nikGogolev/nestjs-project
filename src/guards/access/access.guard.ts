import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class AccessGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    if (this.reflector.get('role', context.getHandler()) === 'public') {
      return true;
    }
    if (this.reflector.get('role', context.getHandler()) === 'admin') {
      if (this.reflector.get('authorized', context.getHandler()) === true) {
        return true;
      }
    }

    return false;
  }
}
