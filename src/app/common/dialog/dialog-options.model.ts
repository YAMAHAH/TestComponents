import { ModalPosition } from '../modal/modal.position.enum';

export interface DialogOptions {
  title: string;
  content: string;
  html?: boolean;
  yes?: string;
  no?: string;
  cssClass?: string;
  ignoreBackdropClick?: boolean;
  modalPosition?: ModalPosition;
  minWidth?: number;
  minHeight?: number;
  modal?: boolean;
  backdrop?: boolean;
  resolve?: any;
}
