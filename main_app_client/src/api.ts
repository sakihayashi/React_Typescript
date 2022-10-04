import Http2jsClient from '@otosense/http2js';

/**
 * To allow accessing app from another computer through redirect
 */
export const getBaseUrl = () => {
  if (process.env.API_BASE_URL) {
    return process.env.API_BASE_URL;
  }
  // trim http:// and port number
  const { href } = window.location;
  let start = href.indexOf('://');
  if (start < 0) {
    start = 0;
  } else {
    start += 3;
  }
  let baseLen = href.indexOf(':', start);
  if (baseLen < 0) {
    baseLen = href.length - start - 1;
  } else {
    baseLen -= start;
  }
  const base = href.substr(start, baseLen);
  return `http://${base}`;
};

const replaceBaseUrl = (url: string) => {
  const parts = url.split(':');
  const suffix = parts[parts.length - 1];
  return `${getBaseUrl()}:${suffix}`;
};

const openApiUrl: string = `${getBaseUrl()}:${
  process.env.API_PORT
}/openapi`;

let client: any;

const makeClient = (): Promise<any> => {
  return fetch(openApiUrl)
    .then((openApiResponse: Response) => openApiResponse.json())
    .then((openApiSpec: any) => {
      openApiSpec.servers.forEach((s, i) => {
        openApiSpec.servers[i]['url'] = replaceBaseUrl(
          openApiSpec.servers[i]['url']
        );
      });
      client = new Http2jsClient(openApiSpec, {}, null);
    });
};

const apiRequest = (methodName: APIS, args: any = {}): Promise<any> => {
  const ready: Promise<void> = client ? Promise.resolve() : makeClient();
  return ready
    .then(() => client[methodName](args))
    .catch((reason) => {
      console.error('apiRequest Error', methodName, reason);
      return reason;
    });
};
export default apiRequest;

export const isErrorResponse = (response: any) => {
  if (response) {
    return response.success === false || response.error != null;
  }
};

export enum APIS {
  PING = 'ping',
  GET_DEVICE_ID = 'get_device_id',
  GET_IP_ADDRESS = 'get_ip_address',
  GET_VERSION = 'get_version',
  GET_CONFIG = 'get_config',
  LOGIN = 'login',
  LIST_ASSET_TYPE = 'list_asset_types',
  CREATE_ASSET_TYPE = 'create_asset_type',
  ADD_VARIANTS_TO_TYPE = 'add_variants_to_type',
  ADD_CHANNEL = 'add_channel',
  SET_CONFIG = 'set_config',
  LATEST_PIPELINE_INFO = 'latest_pipeline_info',
  TEST_STATUS = 'test_status',
  GET_DEFAULTS = 'get_defaults',
  STOP_TESTING = 'stop_testing',
  STORE_FEEDBACK = 'store_feedback',
  START_TESTING = 'start_testing',
  FILTERED_SESSIONS = 'filtered_sessions',
  GET_SESSION_SENSORS_DATA_AS_BASE64 = 'get_session_sensors_data_as_base64',
  SET_PIPELINE_CONFIG = 'set_pipeline_config',
  LIST_READERS = 'list_readers',
  SAVE_OTA_SETTINGS = 'save_ota_settings',
  CHECKED_UPDATES = 'checked_update',
  UNCHECKED_UPDATES = 'unchecked_update',
  LAUNCH_DPP_BUILDER = 'launch_dpp_builder',
}

export type SQLBoolean = 0 | 1;

export interface AssetData extends IErrorResponse {
  _id: number;
  asset_type: string;
  asset_variant: string;
  channel: string;
  pipeline_id: string;
  pipeline_id_counter: number;
  uploaded_sessions: number;
  is_visible: SQLBoolean;
}

export interface BufferReader {
  [x: string]: any;
  buffer_name: string;
  channel_ids?: string[];
  channel_names?: string[];
  fields: Fields[];
  name: string;
  type: string;
}

export interface Fields {
  name?: string;
  type?: string;
  default?: number | string;
  is_per_device_channel?: boolean;
  values?: number[] | string[] | MinMax;
  channel_id?: string;
  if_iepe?: string;
}

export interface MinMax {
  min: number;
  max: number;
}

export interface DPP {
  buffers_names: string[];
  dpp_id: string;
  name: string;
}

export interface IInputs {
  asset_type: string;
  asset_variant: string;
  channel: string;
  pipeline_id: string;
  instance: string;
}

export interface IErrorResponse {
  error?: string;
  message?: string;
  success?: boolean;
}

export interface IResourceData extends IErrorResponse {
  asset: AssetData;
  inputs: IInputs;
}

export type SystemStepMessage = string;

export enum SystemStepIcon {
  empty = 'empty',
  filled = 'filled',
  checked = 'checked',
  warning = 'warning'
}


export interface TestStatus {
  asset_data: {
    asset_type: string;
    asset_variant: string;
    asset_instance: string;
    channel: string;
    pipeline_id: string;
    channel_id: string;
    asset_id: string;
    pipeline_name: string;
  };
  rdy?: {
    name: string;
    value: string;
  },
  sensors?: SensorCondition[];
  start_count: number; // increments every time a session ends
  bt: number;
  is_running: boolean;
  threshold?: number;
  detected_anomalies_count: number;
  is_learning: boolean;
  pipeline_name: string;
  last_session: number;
  quality_score?: number | string;
  is_starting: boolean;
  is_recording: boolean;
  qs_session_num?: number;
  ai_msgs?: AIMsgs[];
  phase_number?: number;
  system_msgs: SystemMessage[];
  system_progress: [SystemStepMessage, SystemStepIcon][];
}
export interface SensorCondition {
  channel_id: string;
  channel_name: string;
  status: SensorStatus;
  message?: string;
  channel_selected?: boolean;
  iepe?: boolean;
  coupling?: string;
  mode?: string;
  range?: string;
}

export interface SystemMessage {
  bt: number;
  severity: string;
  message: string
}

export enum SensorStatus {
  OK = 0,
  WEAK = 1,
  ERROR = 2,
}

export enum TestingViews {
  ASSET_SELECTION = 'ASSET_SELECTION',
  RECORD_AND_TEST = 'RECORD_AND_TEST',
  RESULTS = 'RESULTS',
}

export enum FeedbackEnum {
  UNSET = 0,
  FAIL = 1,
  PASS = 2,
  ALL = 3,
}

export interface IFeedback {
  feedback: FeedbackEnum;
  feedback_comment: string;
}

export interface IResultsData {
  asset_channel: string;
  asset_type: string;
  asset_variant: string;
  asset_instance?: string;
  channel_definition;
  channel_id?: string;
  dpp_id?: number;
  bt: number;
  feedback: FeedbackEnum;
  notes: string;
  is_learning?: SQLBoolean;
  is_uploaded?: SQLBoolean;
  quality_score: number | string;
  pipeline_name: string;
  session_result: SessionResult;
  threshold?: number;
  _id: number;
  sensors?: SensorCondition[],
  rdy?: { name: string, value: string },
  ai_msgs: AIMsgs[];
  sessionNum: number;
}

export interface AIMsgs {
  bt: number;
  message: string;
  severity: string;
}

export interface Config {
  name: string;
  version: string;
  automatic_software_updates: boolean;
  default_locale: string;
}

export interface PipelineInfo extends AssetData {
  pipeline_name: string;
  modified_time: number;
}

export interface SessionResult {
  quality_score: number;
  scores_per_channel: {
    id: number;
    name: string;
    quality_score: number;
  }[];
}
