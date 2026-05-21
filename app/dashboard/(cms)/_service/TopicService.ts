import Fetch from '@root/utils/Fetch';
import CONFIG from '@root/config';
import Result from '@root/app/types/Result';
import TopicModel from '../_types/Topic/TopicModel';

export default class TopicsService {
  config?: RequestInit;
  constructor(jwt: string) {
    if (jwt) this.config = Fetch.SetDefaultHeader(jwt);
  }

  getTopicList= async (): Promise<Result<TopicModel[]>> => {
    return Fetch.Get<Result<TopicModel[]>>(CONFIG.API_BASEPATH + `/cms/GetTopicsHierarchy`, this.config);
  };
  getTopicListForSelect = async (): Promise<Result<TopicModel[]>> => {
    return Fetch.Get<Result<TopicModel[]>>(CONFIG.API_BASEPATH + `/cms/GetTopicListForSelect`, this.config);
  };
  getTopicById = async (topicId : number): Promise<Result<TopicModel>> => {
    const params = new URLSearchParams({ topicId: topicId.toString() });
    return Fetch.Get<Result<TopicModel>>(CONFIG.API_BASEPATH + `/cms/getTopicById?${params.toString()}`, this.config);
  };
  addTopic = async (topic: TopicModel): Promise<Result<TopicModel>> => {
    return Fetch.Post<Result<TopicModel>>(CONFIG.API_BASEPATH + '/cms/addTopic', topic, this.config);
  };
  updateTopic = async (topic: TopicModel): Promise<Result<TopicModel>> => {
    return Fetch.Post<Result<TopicModel>>(CONFIG.API_BASEPATH + '/cms/updateTopic', topic, this.config);
  };
  deleteTopic = async (topicId : number): Promise<Result<null>> => {
    const params = new URLSearchParams({ topicId: topicId.toString() });
    return Fetch.Get<Result<null>>(CONFIG.API_BASEPATH + `/cms/deleteTopic?${params.toString()}`, this.config);
  };
}
