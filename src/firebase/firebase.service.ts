import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { Config } from '../_util/models/config.model';
import { Auth, getAuth } from 'firebase/auth';

@Injectable()
export class FirebaseService {
  app: FirebaseApp;
  auth: Auth;

  constructor(private configService: ConfigService<Config>) {
    this.app = initializeApp({
      apiKey: configService.get<string>('FIREBASE_WEB_API_KEY'),
      authDomain: configService.get<string>('FIREBASE_AUTH_DOMAIN'),
      projectId: configService.get<string>('FIREBASE_PROJECT_ID'),
      storageBucket: configService.get<string>('FIREBASE_STORAGE_BUCKET'),
      messagingSenderId: configService.get<string>(
        'FIREBASE_MESSAGING_SENDER_ID',
      ),
      appId: configService.get<string>('FIREBASE_APP_ID'),
      measurementId: configService.get<string>('FIREBASE_MEASUREMENT_ID'),
    });

    this.auth = getAuth(this.app);
  }
}
