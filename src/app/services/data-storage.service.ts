import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DataStorageService {

    public data: any;

    private storageSub = new Subject<boolean>();

    public constructor() { }

    watchStorage(): Observable<any> {
        return this.storageSub.asObservable();
    }

    setItem(key: string, data: any) {
        localStorage.setItem(key, data);
        this.storageSub.next(true);
    }

    removeItem(key) {
        localStorage.removeItem(key);
        this.storageSub.next(true);
    }

}
