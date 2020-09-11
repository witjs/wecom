import axios, { AxiosRequestConfig, AxiosInstance, AxiosResponse } from "axios";
export interface WecomConfig {
  // =============================下面这几项都是申请企业微信应用时分配给到的，需要和相关负责人说明需要
  // =============================企业微信应用的申请地址 http://office.oa.com/applyfill.aspx?flowid=151
  // 企业微信的的ID
  agentId: number;
  // 企业微信corpid
  corpId: string;
  // 企业微信corpsecret
  corpSecret: string;
  // 企业微信服务器地址
  baseURL?: string;
  // 认证失败的错误重试次数 其他错误信息不进行重试
  retryTimes?: number;
}

const globalConfig: WecomConfig = {
  // 企业微信的的ID
  agentId: null,
  // 企业微信corpid
  corpId: null,
  // 企业微信corpsecret
  corpSecret: null,
  // 企业微信服务器地址
  baseURL: "https://qyapi.weixin.qq.com/cgi-bin/",
  // 认证失败的错误重试次数 其他错误信息不进行重试
  retryTimes: 3,
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
  public readonly api: Record<string, any> = {};
  // 请求需要用到的token
  private _token: string;
  // 当前的尝试次数
  private _RetryTimes: number = 0;

  /**
   * @description 设置全局配置
   * @static
   * @param {Partial<WecomConfig>} config
   * @memberof Wecom
   */
  public static setGlobal(config: Partial<WecomConfig>) {
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
    });
    // 如果认证失败的话 尝试重新获取token然后重试
    this.client.interceptors.response.use(
      (response) => {
        this._RetryTimes = 0;
        return response;
      },
      async (error) => {
        if (
          error.response &&
          // 认证失败
          error.response.status === 401 &&
          // 请求次数未达上限
          this._RetryTimes < this.config.retryTimes
        ) {
          ++this._RetryTimes;
          error.config.params.access_token = await this.getToken();
          return this.client.request(error.config);
        }
        this._RetryTimes = 0;
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
  async request<T = any, R = AxiosResponse<T>>(
    config: AxiosRequestConfig
  ): Promise<R> {
    return this.client.request(config);
  }

  /**
   * @description 创建新的API
   * @template T
   * @template R
   * @param {string} path
   * @param {() => Promise<R>} fn
   * @return {*}
   * @memberof Wecom
   */
  createApi<T = any, R = AxiosResponse<T>>(
    path: string,
    fn: () => Promise<R>
  ): any {
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
        console.log("已经到了最后一位了", this.api, key);
        currentPath[key] = fn.bind(this);
      } else {
        // 添加命名空间
        currentPath[key] = currentPath[key] || {};
        currentPath = currentPath[key];
      }
    }
    return currentPath;
  }
}