import axios, { AxiosInstance } from 'axios';
import { IAcuparseTower, IAcuparseTowerResponse } from './acuparse.types';
import { Mutex } from 'async-mutex';
import debug from 'debug';
import _ from 'lodash';

const TOWER_REQUEST_INTERVAL_SECONDS = 5; // minutes

// Convert the interval to milliseconds
const seconds = 60;
const milliseconds = 1000;
const TOWER_REQUEST_INTERVAL = TOWER_REQUEST_INTERVAL_SECONDS * seconds * milliseconds;

const logAcuparse = debug('acuparse-mqtt:acuparseClient');

/**
 * Acuparse client.
 */
export class AcuparseClient {
  private readonly host: string;

  private readonly client: AxiosInstance;

  private cachedTowers: IAcuparseTowerResponse | null = null;

  private lastTowerRequest: Date | null = null;

  private readonly mutex = new Mutex();

  /**
   * Constructor
   *
   * @param acuparseHost - Acuparse host
   */
  public constructor(acuparseHost: string) {
    this.host = acuparseHost;

    this.client = axios.create({
      baseURL: acuparseHost
    });
  }

  /**
   * Retrieves all towers from the Acuparse server.
   *
   * @param forceUpdate - Skips trying to use the cached tower data, and forces us to retrieve all tower data.
   * @returns - Returns the tower response.
   */
  public async getAllTowers(forceUpdate: boolean = false): Promise<IAcuparseTowerResponse | null> {
    // There is a possibility of multiple simultaneous calls to this function. Due to the oddities of Javascript
    // event loop, it is possible that when we start retrieving the towers a 2nd call could enter the 'update' region.
    // This would leave us with two, simultaneous, attempts to retrieve tower data when we might not want that.
    const release = await this.mutex.acquire();
    try {
      if (forceUpdate || this.cachedTowers === null || this.shouldGetNewTowers()) {
        logAcuparse('Retrieving towers from %s ...', this.host);

        const response = await this.client.get<IAcuparseTowerResponse>('/api/v1/json/tower');

        this.cachedTowers = response.data;
        this.lastTowerRequest = new Date();

        logAcuparse('Retrieved towers!');
      }
    } catch (err) {
      logAcuparse('Failed to retrieve towers... %s', err);
    } finally {
      release();
    }

    return this.cachedTowers;
  }

  /**
   * Checks for the specified tower. If the tower isn't in cache we attempt to force refresh the tower cache. If the
   * tower still isn't found we return null.
   *
   * @param towerID - ID of the tower to retrieve.
   * @returns - The requested tower, or null if it doesn't exist on the Acuparse server.
   */
  public async getTower(towerID: string): Promise<IAcuparseTower | null> {
    // There is a possibility of multiple simultaneous calls to this function. Due to the oddities of Javascript
    // event loop, it is possible that when we start retrieving the towers a 2nd call could enter the 'update' region.
    // This would leave us with two, simultaneous, attempts to retrieve tower data when we might not want that.
    const release = await this.mutex.acquire();

    let tower: IAcuparseTower | null =  this.cachedTowers?.towers?.[towerID] ?? null;
    if (tower === null) {
      try {
        logAcuparse('Retrieving tower %s from %s', towerID, this.host);

        const response = await this.client.get<IAcuparseTowerResponse>('/api/v1/json/tower',
          { params: { id: towerID } });

        if (this.cachedTowers === null) {
          this.cachedTowers = response.data;
        } else {
          _.merge(this.cachedTowers, response.data);
        }
        tower = this.cachedTowers?.towers?.[towerID] ?? null;

        logAcuparse('Retrieved tower %s with name %s', towerID, tower?.name ??  '<unknown>');
      } catch (err) {
        logAcuparse('Failed to retrieve towers... %s', err);
      } finally {
        release();
      }
    }

    return tower;
  }

  /**
   * Checks if the specified tower is in cache.
   *
   * @param towerID - ID of the tower to check for
   * @returns - True if the tower is in cache.
   * @protected
   */
  protected isTowerInCache(towerID: string): boolean {
    return this.cachedTowers?.towers?.[towerID] !== undefined;
  }

  /**
   * Should we check for new tower data?
   *
   * @returns True if we should check for new tower data.
   * @protected
   */
  protected shouldGetNewTowers(): boolean {
    let response = true;

    if (this.lastTowerRequest !== null && this.cachedTowers !== null) {
      const updateInterval = Date.now() - this.lastTowerRequest.getTime();
      response = updateInterval > TOWER_REQUEST_INTERVAL;
    }

    return response;
  }
}

/**
 * Global client
 */
let client: AcuparseClient | null = null;

/**
 * Sets up the global acuparse client.
 *
 * @param hostname - Host to connect too
 */
export function setupAcuparse(hostname: string): void {
  client = new AcuparseClient(hostname);
}

/**
 * Retrieves the acuparse client.
 *
 * @returns - The Acuparse client
 * @throws {Error} Throws an error if the acuparse client has not been setup via {@link setupAcuparse}
 */
export function getAcuparse(): AcuparseClient {
  if (client === null) {
    throw new Error('Acuparse client is not initialized');
  }

  return client;
}