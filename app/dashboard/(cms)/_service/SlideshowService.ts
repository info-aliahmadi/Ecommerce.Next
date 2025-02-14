import axios from 'axios';
import CONFIG from '@root/config';
import { setDefaultHeader } from '@root/utils/axiosHeaders';
import Result from '@root/app/types/Result';

export default class SlideshowService {
  constructor(jwt : string) {
    setDefaultHeader(jwt);
  }
  getSlideshowList= async (): Promise<Result<SlideshowModel[]>> => {
    return new Promise((resolve, reject) => {
      axios
        .get(CONFIG.API_BASEPATH + '/cms/GetSlideshowList')
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  getSlideshowById = async (slideshowId : number): Promise<Result<SlideshowModel>> => {
    return new Promise((resolve, reject) => {
      axios
        .get(CONFIG.API_BASEPATH + '/cms/getSlideshowById', { params: { slideshowId: slideshowId } })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  addSlideshow = async (slideshow: SlideshowModel): Promise<Result<SlideshowModel>> => {
    return new Promise((resolve, reject) => {
      axios
        .post(CONFIG.API_BASEPATH + '/cms/addSlideshow', slideshow)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  updateSlideshow = async (slideshow: SlideshowModel): Promise<Result<SlideshowModel>> => {
    return new Promise((resolve, reject) => {
      axios
        .post(CONFIG.API_BASEPATH + '/cms/updateSlideshow', slideshow)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  updateSlideshowOrders = async (slideshowList: SlideshowModel[]): Promise<Result<SlideshowModel[]>> => {
    return new Promise((resolve, reject) => {
      axios
        .post(CONFIG.API_BASEPATH + '/cms/updateSlideshowOrders', slideshowList)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  visibleSlideshow = async (slideshowId : number): Promise<Result<SlideshowModel>> => {
    return new Promise((resolve, reject) => {
      axios
        .get(CONFIG.API_BASEPATH + '/cms/VisibleSlideshow', { params: { slideshowId: slideshowId } })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  deleteSlideshow = async (slideshowId : number): Promise<Result<SlideshowModel>> => {
    return new Promise((resolve, reject) => {
      axios
        .get(CONFIG.API_BASEPATH + '/cms/deleteSlideshow', { params: { slideshowId: slideshowId } })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
}
