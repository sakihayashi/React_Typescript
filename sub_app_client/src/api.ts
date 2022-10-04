import Http2jsClient from '@otosense/http2js';

/**
 * To allow accessing app from another computer through redirect
 */
export function getBaseUrl() {
  if (process.env.API_BASE_URL) {
    return process.env.API_BASE_URL;
  }
  // trim http:// and port number
  const {href} = window.location;
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
}

function replaceBaseUrl(url: string) {
  const parts = url.split(':');
  const suffix = parts[parts.length - 1];
  return `${getBaseUrl()}:${suffix}`;
}

const openApiUrl: string = `${getBaseUrl()}:${process.env.API_PORT}/openapi`;

let client: any;

function makeClient(): Promise<any> {
  return fetch(openApiUrl)
  .then((openApiResponse: Response) => openApiResponse.json())
  .then((openApiSpec: any) => {
    openApiSpec.servers.forEach((s, i) => {
      openApiSpec.servers[i]['url'] = replaceBaseUrl(openApiSpec.servers[i]['url']);
    });
    client = new Http2jsClient(openApiSpec, {}, null);
  });
}

export default function apiRequest(methodName: APIS, args: any = {}): Promise<any> {
  const ready: Promise<void> = client ?
    Promise.resolve() : makeClient();
  return ready.then(() => client[methodName](args)).catch((reason) => {
    console.error('apiRequest Error', methodName, reason);
    return reason;
  });
}

export function isErrorResponse(response: any) {
  if (response) {
    return response.success === false || response.error != null;
  }
}

export enum APIS {
  PING = 'ping',
  // GET_DEVICE_ID = 'get_device_id',
  // GET_IP_ADDRESS = 'get_ip_address',
  GET_VERSION = 'get_version',
  GET_CONFIG = 'get_config',
  // LOGIN = 'login',
  LIST_ASSET_TYPE = 'list_asset_types',
  // CREATE_ASSET_TYPE = 'create_asset_type',
  // ADD_VARIANTS_TO_TYPE = 'add_variants_to_type',
  // ADD_CHANNEL = 'add_channel',
  // SET_CONFIG = 'set_config',
  // LATEST_PIPELINE_INFO = 'latest_pipeline_info',
  // TEST_STATUS = 'test_status',
  // GET_DEFAULTS = 'get_defaults',
  // STOP_TESTING = 'stop_testing',
  // STORE_FEEDBACK = 'store_feedback',
  FILTERED_SESSIONS = 'filtered_sessions',
  // GET_SESSION_SENSORS_DATA_AS_BASE64 = 'get_session_sensors_data_as_base64',

  // dpp-builder specific api
  STOP_DPP_BUILDER = 'stop_dpp_builder',
  // GET_DEVICE_ID = 'get_device_id',
  // GET_IP_ADDRESS = 'get_ip_address',
  // LOGIN = 'login',
  // UPLOAD_SESSIONS_BY_ID = 'upload_sessions_by_id',
  // SET_PIPELINE_CONFIG = 'set_pipeline_config',
  // PIPELINE_CONFIG_OPTIONS = 'pipeline_config_options',

  // dpp-builder specific api
  SELECT_ASSET = 'select_asset',
  SELECT_SESSIONS = 'select_sessions',
  PLC_TAGS = 'plc_tags',
  SET_PHASE_DEFINITIONS = 'set_phase_definitions',
  TRAIN_MODELS = 'train_models',
  SET_AGGREGATION_METHODS = 'set_aggregation_methods',
  SAVE_DPP_BUILD = 'save_dpp_build',
  LIST_DPP_BUILDS = 'list_dpp_builds',
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
  buffer_name: string;
  channel_ids?: string[];
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
  asset_id: string;
  asset_type: string;
  asset_variant: string;
  asset_instance: string;
  channel_id?: string;
  bt: number;
  feedback: FeedbackEnum;
  notes: string;
  is_learning: SQLBoolean;
  is_pc_health_uploaded: SQLBoolean;
  is_uploaded: SQLBoolean;
  quality_score: number;
  pc_health: any;
  pipeline_name: string;
  session_result: SessionResult;
  sensor_data: string;
  threshold: number;
  _id: number;
}

export interface SessionResult {
  quality_score: number;
  scores_per_channel: Array<{
    id: number;
    name: string;
    quality_score: number;
  }>;
}

export interface DppRecord {
  last_modification_date: number;
  pipeline_state: {
    asset_type: string;
    asset_variant: string;
    asset_pipeline: string;
  };
}

export interface ChannelScores {
  channel_id: string;
  chk_size_mcs: number;
  scores: Array<{ time: number; value: number }>;
}

export interface PhaseResults {
  bt: number;
  tt: number;
  channelScores: {
    [channelId: string]: ChannelScores;
  };
}

export interface TrainingResults {
  outlier_scores: { [sessionId: string]: { [phaseId: string]: PhaseResults } };
  chunk_score_aggregate: { [sessionId: string]: { [phaseId: string]: { [channelId: string]: number } } };
  quality_score: { [sessionId: string]: number };
}
