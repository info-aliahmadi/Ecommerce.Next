import Fetch from '@root/utils/Fetch';
import CONFIG from '@root/config';
import Result from '@root/app/types/Result';
import SlideshowModel from '../_types/Slideshow/SlideshowModel';

export default class SlideshowService {
  config?: RequestInit;
  constructor(jwt: string) {
    if (jwt) this.config = Fetch.SetDefaultHeader(jwt);
  }

  getSlideshowList= async (): Promise<Result<SlideshowModel[]>> => {
    return Fetch.Get<Result<SlideshowModel[]>>(CONFIG.API_BASEPATH + `/cms/GetSlideshowList`, this.config);
  };
  getSlideshowById = async (slideshowId : number): Promise<Result<SlideshowModel>> => {
    const params = new URLSearchParams({ slideshowId: slideshowId.toString() });
    return Fetch.Get<Result<SlideshowModel>>(CONFIG.API_BASEPATH + `/cms/getSlideshowById?${params.toString()}`, this.config);
  };
  addSlideshow = async (slideshow: SlideshowModel): Promise<Result<SlideshowModel>> => {
    return Fetch.Post<Result<SlideshowModel>>(CONFIG.API_BASEPATH + '/cms/addSlideshow', slideshow, this.config);
  };
  updateSlideshow = async (slideshow: SlideshowModel): Promise<Result<SlideshowModel>> => {
    return Fetch.Post<Result<SlideshowModel>>(CONFIG.API_BASEPATH + '/cms/updateSlideshow', slideshow, this.config);
  };

  updateSlideshowOrders = async (slideshowList: SlideshowModel[]): Promise<Result<SlideshowModel[]>> => {
    return Fetch.Post<Result<SlideshowModel[]>>(CONFIG.API_BASEPATH + '/cms/updateSlideshowOrders', slideshowList, this.config);
  };
  visibleSlideshow = async (slideshowId : number): Promise<Result<SlideshowModel>> => {
    const params = new URLSearchParams({ slideshowId: slideshowId.toString() });
    return Fetch.Get<Result<SlideshowModel>>(CONFIG.API_BASEPATH + `/cms/VisibleSlideshow?${params.toString()}`, this.config);
  };
  deleteSlideshow = async (slideshowId : number): Promise<Result<SlideshowModel>> => {
    const params = new URLSearchParams({ slideshowId: slideshowId.toString() });
    return Fetch.Get<Result<SlideshowModel>>(CONFIG.API_BASEPATH + `/cms/deleteSlideshow?${params.toString()}`, this.config);
  };
}
