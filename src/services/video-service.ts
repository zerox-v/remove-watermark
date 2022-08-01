import { post } from '@/utils/request';

export function getVideoInfo(url:String) {
  return post("video/getVideoInfo", { url });
}

export function getParsingInfo() {
  return post("video/getVideoInfo");
}
