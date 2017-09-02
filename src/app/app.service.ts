import { AuthGuard } from './common/auth/auth.guard';
import { AuthService } from './services/auth.service';
import { MyDataResolver } from './common/my-data-resolver';
import { LoadScriptService } from './services/load-script-service';
import { CanPageAnimateGuard } from './common/page-animate-guard';
import { HttpService } from './services/http.service';
import { BlockUIService } from './services/blockui.service';
import { AppStoreService } from './services/app.store.service';
import { RouterService } from './services/router.service';
import { FormService } from './components/form/FormService';
import { CarService } from './services/car/carService';

export const appRootProviders = [
    AuthGuard,
    AuthService,
    MyDataResolver,
    LoadScriptService,
    CanPageAnimateGuard,
    HttpService,
    BlockUIService,
    AppStoreService,
    RouterService,
    CarService
];