import { JsonProperty } from 'json-typescript-mapper';
export class CommissionRequestModel {

    @JsonProperty('agent')
    private _agent: number;

    @JsonProperty('super_agent')
    private _superAgent: number;

    @JsonProperty('system')
    private _system: number;

    @JsonProperty('roi')
    private _roi: number;

    @JsonProperty('adb')
    private _adb: number;

    @JsonProperty('pps')
    private _pps: number;

    constructor() {
        this._agent = undefined;
        this._superAgent = undefined;
        this._system = undefined;
        this._roi = undefined;
        this._adb = undefined;
        this._pps = undefined;
    }

    /**
     * Getter agent
     * @return {number}
     */
    public get agent(): number {
        return this._agent;
    }

    /**
     * Getter superAgent
     * @return {number}
     */
    public get superAgent(): number {
        return this._superAgent;
    }

    /**
     * Getter system
     * @return {number}
     */
    public get system(): number {
        return this._system;
    }

    /**
     * Getter roi
     * @return {number}
     */
    public get roi(): number {
        return this._roi;
    }

    /**
     * Getter adb
     * @return {number}
     */
    public get adb(): number {
        return this._adb;
    }

    /**
     * Getter pps
     * @return {number}
     */
    public get pps(): number {
        return this._pps;
    }

    /**
     * Setter agent
     * @param {number} value
     */
    public set agent(value: number) {
        this._agent = value;
    }

    /**
     * Setter superAgent
     * @param {number} value
     */
    public set superAgent(value: number) {
        this._superAgent = value;
    }

    /**
     * Setter system
     * @param {number} value
     */
    public set system(value: number) {
        this._system = value;
    }

    /**
     * Setter roi
     * @param {number} value
     */
    public set roi(value: number) {
        this._roi = value;
    }

    /**
     * Setter adb
     * @param {number} value
     */
    public set adb(value: number) {
        this._adb = value;
    }

    /**
     * Setter pps
     * @param {number} value
     */
    public set pps(value: number) {
        this._pps = value;
    }


}
