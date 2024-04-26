import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';

@Injectable()
export class HashingService {

    private readonly options: argon2.Options = {
        type: argon2.argon2id,
        memoryCost: 2 ** 16, // 64MB
        timeCost: 3,
        parallelism: 2,
        hashLength: 32,
    };

    async hash(plainText: string): Promise<string> {
        if (!plainText) throw new Error('A plainText should be provided');

        return (await argon2.hash(plainText, this.options));
    }

    async compare(hash: string, plainText: string): Promise<boolean> {
        if (!hash) throw new Error('A hash should be provided');
        else if (!plainText) throw new Error('A plainText should be provided');

        return (await argon2.verify(hash, plainText));
    }

}
