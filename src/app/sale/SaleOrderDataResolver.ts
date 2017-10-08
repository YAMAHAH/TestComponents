import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';


@Injectable()
export class SaleOrderDataResolver implements Resolve<any> {
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
        //获取某个模块所有的后台数据,然后返回
        return new Promise<any>(resolve => {
            return resolve({ message: "获取某个模块所有的后台数据,然后返回" });
        });
        // let id = route.paramMap.get('id');

        // return this.cs.getCrisis(id).then(crisis => {
        //     if (crisis) {
        //         return crisis;
        //     } else { // id not found
        //         this.router.navigate(['/crisis-center']);
        //         return null;
        //     }
        // });
    }

}