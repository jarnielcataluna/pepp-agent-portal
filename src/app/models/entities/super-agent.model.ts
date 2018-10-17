
import { JsonProperty } from 'json-typescript-mapper';
export class SuperAgentModel {

    @JsonProperty('id')
    private _id: number;

    @JsonProperty('username')
    private _username: string;

    @JsonProperty('password')
    private _password: string;

    @JsonProperty('name')
    private _name: string;

    @JsonProperty('contact')
    private _contact: string;

    @JsonProperty('address')
    private _address: string;


    /**
     * Getter id
     * @return {number}
     */
    public get id(): number {
        return this._id;
    }

    /**
     * Setter id
     * @param {number} value
     */
    public set id(value: number) {
        this._id = value;
    }


    /**
     * Getter username
     * @return {string}
     */
    public get username(): string {
        return this._username;
    }

    /**
     * Getter password
     * @return {string}
     */
    public get password(): string {
        return this._password;
    }

    /**
     * Getter name
     * @return {string}
     */
    public get name(): string {
        return this._name;
    }

    /**
     * Getter contact
     * @return {string}
     */
    public get contact(): string {
        return this._contact;
    }

    /**
     * Getter address
     * @return {string}
     */
    public get address(): string {
        return this._address;
    }

    /**
     * Setter username
     * @param {string} value
     */
    public set username(value: string) {
        this._username = value;
    }

    /**
     * Setter password
     * @param {string} value
     */
    public set password(value: string) {
        this._password = value;
    }

    /**
     * Setter name
     * @param {string} value
     */
    public set name(value: string) {
        this._name = value;
    }

    /**
     * Setter contact
     * @param {string} value
     */
    public set contact(value: string) {
        this._contact = value;
    }

    /**
     * Setter address
     * @param {string} value
     */
    public set address(value: string) {
        this._address = value;
    }



}
