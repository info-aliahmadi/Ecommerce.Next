import LinkModel from '../Link/LinkModel';

export default interface LinkSectionModel {
    id: number;
    key: string;
    title: string;
    isVisible: boolean;
    links: LinkModel[];
  }
  