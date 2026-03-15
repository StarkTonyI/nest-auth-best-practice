import { SetMetadata } from "@nestjs/common";

export const TokenMetaData = (token: 'access' | 'refresh') => SetMetadata('tokenType', token);

