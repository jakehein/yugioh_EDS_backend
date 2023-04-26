import { ConfigService } from '@nestjs/config';
import { FirebaseApp } from 'firebase/app';
import { Config } from '../_util/models/config.model';
import { Auth } from 'firebase/auth';
export declare class FirebaseService {
    private configService;
    app: FirebaseApp;
    auth: Auth;
    constructor(configService: ConfigService<Config>);
}
