import axios, { AxiosRequestConfig, AxiosInstance, AxiosResponse } from "axios";
import { BaseRet } from "./common/interface";
export interface WecomConfig {
  // 企业微信企业ID
  corpId: string;
  // 企业微信corpsecret
  corpSecret: string;
  // 企业微信服务器地址
  baseURL?: string;
  // 认证失败的错误重试次数 其他错误信息不进行重试
  retryTimes?: number;
}

const globalConfig: WecomConfig = {
  // 企业微信corpid
  corpId: null,
  // 企业微信corpsecret
  corpSecret: null,
  // 企业微信服务器地址
  baseURL: "https://qyapi.weixin.qq.com/cgi-bin/",
  // 认证失败的错误重试次数 其他错误信息不进行重试
  retryTimes: 3,
};

const retry = <T>(handler: () => Promise<T>, times = 3): Promise<T> => {
  return new Promise((resolve, reject) => {
    handler()
      .then(resolve)
      .catch((e) => {
        times > 0 ? retry(handler, --times) : reject(e);
      });
  });
};

/**
 * @description 企业微信Node Api
 * @export
 * @class Wecom
 */
export class Wecom {
  // 企业微信基本配置信息
  public readonly config: WecomConfig;
  // 发送请求的client
  public readonly client: AxiosInstance;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public readonly api: Record<string, any> = {};
  // 请求需要用到的token
  private _token: string;

  /**
   * @description 设置全局配置
   * @static
   * @param {Partial<WecomConfig>} config
   * @memberof Wecom
   */
  public static setGlobal(config: Partial<WecomConfig>): void {
    Object.assign(globalConfig, config);
  }
  /**
   * Creates an instance of Wecom.
   * @param {Partial<WecomConfig>} config 企业微信基本配置信息
   * @memberof Wecom
   */
  constructor(config: Partial<WecomConfig>) {
    this.config = {
      ...globalConfig,
      ...config,
    };
    // 对参数做一些简单的校验 如果必要的参数不完整的话 直接抛出异常
    for (const [key, value] of Object.entries(this.config)) {
      if (!value) {
        throw new Error(`${key} should not be ${value}`);
      }
    }
    // 创建请求的客户端
    this.client = axios.create({
      baseURL: this.config.baseURL,
      validateStatus: () => {
        return true;
      },
      params: {},
    });
    // 拦截器添加access_token
    this.client.interceptors.request.use(async (config: AxiosRequestConfig) => {
      if (config.url !== "/gettoken") {
        if (!this._token) {
          await this.getToken();
        }
        config.params["access_token"] = this._token;
      }
      return config;
    }, Promise.reject);
    // 如果认证失败的话 尝试重新获取token然后重试
    this.client.interceptors.response.use(
      async (response) => {
        if (
          [40014, 42001].includes(response.data.errcode) // 认证失败
        ) {
          this._token = null;
          throw new axios.Cancel("TOKENERROR");
        } else {
          return response;
        }
      },
      async (error) => {
        if (
          error.response &&
          // 认证失败
          error.response.status === 401
        ) {
          this._token = null;
          return this.client.request(error.config);
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * @description 获取接口请求所需的token
   * @return {*}  {Promise<string>}
   * @memberof Wecom
   */
  async getToken(): Promise<string> {
    const { data } = await this.client.get("/gettoken", {
      params: {
        corpid: this.config.corpId,
        corpsecret: this.config.corpSecret,
      },
    });
    if (!data.access_token) {
      throw new Error(data.errmsg);
    }
    return (this._token = data.access_token);
  }

  /**
   * @description 发送企业微信请求
   * @template T
   * @template R
   * @param {AxiosRequestConfig} config 配置参数和axios的参数保持一致
   * @return {*}  {Promise<R>}
   * @memberof Wecom
   */
  async request<T = BaseRet, R = AxiosResponse<T>>(
    config: AxiosRequestConfig
  ): Promise<R> {
    const doRequest = (): Promise<R> => {
      return new Promise(async (resolve, reject) => {
        this.client.request<T, R>(config).then(resolve).catch(reject);
      });
    };
    return retry(doRequest, this.config.retryTimes);
  }

  /**
   * @description 添加API
   * @template T
   * @param {string} path
   * @param {() => T} fn
   * @return {*}  {Wecom}
   * @memberof Wecom
   */
  createApi<T = unknown>(path: string, fn: () => T): Wecom {
    let currentPath = this.api;
    const pathArr = path.split(".");
    while (pathArr.length) {
      const key = pathArr.shift();
      // 如果已经到了最后一位
      if (pathArr.length === 0) {
        // 查询是否已经在当前的命名空间下有内容
        if (currentPath[key]) {
          throw new Error("Path Conflic");
        }
        currentPath[key] = fn.bind(this);
      } else {
        // 添加命名空间
        currentPath[key] = currentPath[key] || {};
        currentPath = currentPath[key];
      }
    }
    return this;
  }
}
