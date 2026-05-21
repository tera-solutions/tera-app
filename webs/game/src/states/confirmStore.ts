import { makeAutoObservable, toJS } from "mobx";
import { IConfirmStore } from "./_interface";
import * as CSS from "csstype";

export class ConfirmStore {
  openConfirm = false;
  onOk = null;
  onCancel = null;
  content = null;
  type = null;
  align: CSS.Property.TextAlign = "center";
  props = {} as any;

  constructor() {
    makeAutoObservable(this);
  }
  pushEvent() {
    const event = new CustomEvent("ConfirmStore", {
      detail: toJS(this),
    });
    window.dispatchEvent(event);
  }
  setOpenConfirm = (value: IConfirmStore) => {
    this.openConfirm = true;
    this.onOk = value?.onOk || null;
    this.onCancel = value?.onCancel || null;
    this.content = value?.content || null;
    this.type = value?.type || null;
    this.align = value?.align || "center";
    this.props = value?.props || {};
    this.pushEvent();
  };

  setCloseConfirm = () => {
    this.openConfirm = false;
    this.onOk = null;
    this.onCancel = null;
    this.content = null;
    this.type = null;
    this.props = {};
    this.pushEvent();
  };
}
