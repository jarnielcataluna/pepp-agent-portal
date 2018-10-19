
import { JsonProperty } from 'json-typescript-mapper';
export class LoginRequestModel {

    @JsonProperty('username')
    private _username: number;

    @JsonProperty('password')
    private _password: string;

    get username() {
        return this._username;
    }

    set username(value) {
        this._username = value;
    }

    get password() {
        return this._password;
    }

    set password(value) {
        this._password = value;
    }

}
