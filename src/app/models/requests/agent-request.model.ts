import { JsonProperty } from 'json-typescript-mapper';
export class AgentRequestModel {

    @JsonProperty('username')
    private _username: string;

    @JsonProperty('password')
    private _password: string;

    @JsonProperty('device_id')
    private _deviceId: string;

    @JsonProperty('sim_card_info')
    private _simCardInfo: string;

    @JsonProperty('first_name')
    private _firstName: string;

    @JsonProperty('last_name')
    private _lastName: string;

    @JsonProperty('city')
    private _city: string;

    @JsonProperty('service_fee_category')
    private _feeCategory: number;

    @JsonProperty('super_agent_id')
    private _superAgentId: number;

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
     * Getter deviceId
     * @return {string}
     */
    public get deviceId(): string {
        return this._deviceId;
    }

    /**
     * Getter simCardInfo
     * @return {string}
     */
    public get simCardInfo(): string {
        return this._simCardInfo;
    }

    /**
     * Getter firstName
     * @return {string}
     */
    public get firstName(): string {
        return this._firstName;
    }

    /**
     * Getter lastName
     * @return {string}
     */
    public get lastName(): string {
        return this._lastName;
    }

    /**
     * Getter city
     * @return {string}
     */
    public get city(): string {
        return this._city;
    }

    /**
     * Getter feeCategory
     * @return {number}
     */
    public get feeCategory(): number {
        return this._feeCategory;
    }

    /**
     * Getter $superAgentId
     * @return {number}
     */
    public get superAgentId(): number {
        return this._superAgentId;
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
     * Setter deviceId
     * @param {string} value
     */
    public set deviceId(value: string) {
        this._deviceId = value;
    }

    /**
     * Setter simCardInfo
     * @param {string} value
     */
    public set simCardInfo(value: string) {
        this._simCardInfo = value;
    }

    /**
     * Setter firstName
     * @param {string} value
     */
    public set firstName(value: string) {
        this._firstName = value;
    }

    /**
     * Setter lastName
     * @param {string} value
     */
    public set lastName(value: string) {
        this._lastName = value;
    }

    /**
     * Setter city
     * @param {string} value
     */
    public set city(value: string) {
        this._city = value;
    }

    /**
     * Setter feeCategory
     * @param {number} value
     */
    public set feeCategory(value: number) {
        this._feeCategory = value;
    }

    /**
     * Setter $superAgentId
     * @param {number} value
     */
    public set superAgentId(value: number) {
        this._superAgentId = value;
    }




}
